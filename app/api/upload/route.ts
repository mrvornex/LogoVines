import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import Notification from "@/models/Notification";
import { jwtVerify } from "jose";

// Verify admin token — must have role:"admin" in payload
async function isAdmin(req: Request): Promise<boolean> {
  const cookie = req.headers.get("cookie") || "";
  const token  = cookie.split(";").find((c) => c.trim().startsWith("admin_token="))?.split("=")[1];
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    return (payload as any).role === "admin";
  } catch { return false; }
}

// Get user ID from user token
async function getUserId(req: Request): Promise<string | null> {
  const cookie = req.headers.get("cookie") || "";
  const token  = cookie.split(";").find((c) => c.trim().startsWith("user_token="))?.split("=")[1];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    return (payload as any).userId;
  } catch { return null; }
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

    // ── Check who is uploading
    // IMPORTANT: Check user_token FIRST — if user is logged in, treat as user
    // even if admin_token cookie also exists in browser
    const userId      = await getUserId(req);
    const adminUpload = userId ? false : await isAdmin(req);

    console.log("[UPLOAD] isAdmin:", adminUpload, "userId:", userId);

    if (!adminUpload && !userId) {
      return NextResponse.json({ success: false, message: "Please login to upload" }, { status: 401 });
    }

    const status     = adminUpload ? "approved" : "pending";
    const uploadedBy = userId ?? null;

    console.log("[UPLOAD] status:", status, "uploadedBy:", uploadedBy);

    const uploadDir = path.join(process.cwd(), "public/uploads/logos");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // ── Single image
    if (singleFile && singleFile.size > 0) {
      if (!title || !desc)
        return NextResponse.json({ success: false, message: "Title and description required" });

      const bytes    = await singleFile.arrayBuffer();
      const buffer   = Buffer.from(bytes);
      const baseName = singleFile.name.split(/[\\/]/).pop() || singleFile.name;
      const fileName = `${Date.now()}-${baseName}`;
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);

      const newLogo = await Logo.create({
        imageUrl: `/uploads/logos/${fileName}`,
        title, desc, category,
        folderName: null,
        type, uploadedBy, status,
      });

      // Notify user on submission
      if (uploadedBy) {
        await Notification.create({
          userId:  uploadedBy,
          type:    "upload_success",
          message: `Your logo "${title}" has been submitted and is pending review.`,
          logoId:  newLogo._id,
        });
      }

      return NextResponse.json({ success: true, logo: newLogo, status });
    }

    // ── Folder upload
    if (folderFiles.length > 0) {
      if (!folderName)
        return NextResponse.json({ success: false, message: "Folder name required" });

      const saved: any[] = [];

      for (let i = 0; i < folderFiles.length; i++) {
        const file = folderFiles[i];
        if (!file || file.size === 0) continue;

        const imgTitle    = (data.get(`folderTitles[${i}]`)     as string)?.trim() || file.name.replace(/\.[^.]+$/, "");
        const imgDesc     = (data.get(`folderDescs[${i}]`)      as string)?.trim() || "Logo";
        const imgCategory = (data.get(`folderCategories[${i}]`) as string)?.trim() || category;

        const bytes    = await file.arrayBuffer();
        const buffer   = Buffer.from(bytes);
        const baseName = file.name.split(/[\\/]/).pop() || file.name;
        const fileName = `${Date.now()}-${i}-${baseName}`;
        fs.writeFileSync(path.join(uploadDir, fileName), buffer);

        const logo = await Logo.create({
          imageUrl: `/uploads/logos/${fileName}`,
          title: imgTitle, desc: imgDesc,
          category: imgCategory,
          folderName, type, uploadedBy, status,
        });

        saved.push(logo);
      }

      if (!saved.length)
        return NextResponse.json({ success: false, message: "No valid images uploaded" });

      // Notify user
      if (uploadedBy) {
        await Notification.create({
          userId:  uploadedBy,
          type:    "upload_success",
          message: `Your ${saved.length} logo(s) from "${folderName}" have been submitted and are pending review.`,
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