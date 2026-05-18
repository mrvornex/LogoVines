import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import Notification from "@/models/Notification";
import { jwtVerify } from "jose";

async function getUserId(req: Request): Promise<string | null> {
  const cookie = req.headers.get("cookie") || "";
  const token  = cookie.split(";").find((c) => c.trim().startsWith("user_token="))?.split("=")[1];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    return (payload as any).userId;
  } catch { return null; }
}

function isAdminReq(req: Request): boolean {
  const cookie = req.headers.get("cookie") || "";
  return cookie.includes("admin_token=");
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.formData();

    const singleFile  = data.get("image")      as File | null;
    const title       = (data.get("title")      as string)?.trim();
    const desc        = (data.get("desc")       as string)?.trim();
    const category    = (data.get("category")   as string)?.trim() || "Uncategorized";
    const folderName  = (data.get("folderName") as string)?.trim() || "";
    const type        = (data.get("type")        as string)?.trim() || "brand";
    const folderFiles = data.getAll("folderImages") as File[];

    // Determine uploader + status
    const isAdmin  = isAdminReq(req);
    const userId   = isAdmin ? null : await getUserId(req);
    const status   = isAdmin ? "approved" : "pending";
    const uploadedBy = userId || null;

    const uploadDir = path.join(process.cwd(), "public/uploads/logos");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // ── Single
    if (singleFile && singleFile.size > 0) {
      if (!title || !desc) return NextResponse.json({ success: false, message: "Title and description required" });
      const bytes    = await singleFile.arrayBuffer();
      const buffer   = Buffer.from(bytes);
      const baseName = singleFile.name.split(/[\\/]/).pop() || singleFile.name;
      const fileName = `${Date.now()}-${baseName}`;
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
      const newLogo  = await Logo.create({ imageUrl: `/uploads/logos/${fileName}`, title, desc, category, folderName: null, type, uploadedBy, status });

      if (uploadedBy) {
        await Notification.create({
          userId:  uploadedBy,
          type:    "upload_success",
          message: `Your logo "${title}" has been submitted for review.`,
          logoId:  newLogo._id,
        });
      }
      return NextResponse.json({ success: true, logo: newLogo, status });
    }

    // ── Folder
    if (folderFiles.length > 0) {
      if (!folderName) return NextResponse.json({ success: false, message: "Folder name required" });
      const saved: any[] = [];
      for (let i = 0; i < folderFiles.length; i++) {
        const file = folderFiles[i];
        if (!file || file.size === 0) continue;
        const imgTitle    = (data.get(`folderTitles[${i}]`)     as string)?.trim() || file.name.replace(/\.[^.]+$/, "");
        const imgDesc     = (data.get(`folderDescs[${i}]`)      as string)?.trim() || "Logo";
        const imgCategory = (data.get(`folderCategories[${i}]`) as string)?.trim() || "Uncategorized";
        const bytes    = await file.arrayBuffer();
        const buffer   = Buffer.from(bytes);
        const baseName = file.name.split(/[\\/]/).pop() || file.name;
        const fileName = `${Date.now()}-${i}-${baseName}`;
        fs.writeFileSync(path.join(uploadDir, fileName), buffer);
        const logo = await Logo.create({ imageUrl: `/uploads/logos/${fileName}`, title: imgTitle, desc: imgDesc, category: imgCategory, folderName, type, uploadedBy, status });
        saved.push(logo);
      }
      if (!saved.length) return NextResponse.json({ success: false, message: "No valid images" });

      if (uploadedBy) {
        await Notification.create({
          userId:  uploadedBy,
          type:    "upload_success",
          message: `Your ${saved.length} logos from "${folderName}" have been submitted for review.`,
        });
      }
      return NextResponse.json({ success: true, logos: saved, count: saved.length, status });
    }

    return NextResponse.json({ success: false, message: "No file provided" });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ success: false, message: String(error) });
  }
}