import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import Notification from "@/models/Notification";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { jwtVerify } from "jose";

async function isAdminRequest(req: Request): Promise<boolean> {
  const cookie = req.headers.get("cookie") || "";
  const token  = cookie.split(";").find((c) => c.trim().startsWith("admin_token="))?.split("=")[1];
  console.log("[ADMIN CHECK] token exists:", !!token);
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    console.log("[ADMIN CHECK] role:", (payload as any).role);
    return (payload as any).role === "admin";
  } catch (e) {
    console.log("[ADMIN CHECK] verify failed:", e);
    return false;
  }
}

async function getLoggedInUserId(req: Request): Promise<string | null> {
  const cookie = req.headers.get("cookie") || "";
  const token  = cookie.split(";").find((c) => c.trim().startsWith("user_token="))?.split("=")[1];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    const p = payload as any;
    if (!p.userId) return null;
    return p.userId;
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

    // Who is uploading?
    // Admin check takes priority — if admin_token valid, treat as admin regardless of user_token
    const adminUpload = await isAdminRequest(req);
    const userId      = adminUpload ? null : await getLoggedInUserId(req);

    console.log("[UPLOAD] isAdmin:", adminUpload, "userId:", userId);

    if (!adminUpload && !userId) {
      return NextResponse.json({ success: false, message: "Please login to upload" }, { status: 401 });
    }

    const status     = adminUpload ? "approved" : "pending";
    const uploadedBy = userId ?? null;

    console.log("[UPLOAD] status will be:", status);

    // ── Single image ──────────────────────────────────────
    if (singleFile && singleFile.size > 0) {
      if (!title || !desc)
        return NextResponse.json({ success: false, message: "Title and description required" });

      const bytes    = await singleFile.arrayBuffer();
      const buffer   = Buffer.from(bytes);
      const baseName = singleFile.name.split(/[\\/]/).pop() || singleFile.name;
      const fileName = `${Date.now()}-${baseName.replace(/\s+/g, "_")}`;

      // Upload to Cloudinary
      const { url, publicId } = await uploadToCloudinary(buffer, fileName);

      const newLogo = await Logo.create({
        imageUrl:     url,
        cloudinaryId: publicId,
        title, desc, category,
        folderName:   null,
        type, uploadedBy, status,
      });

      console.log("[UPLOAD] Logo saved — status:", status, "cloudinaryId:", publicId);

      if (uploadedBy) {
        await Notification.create({
          userId:  uploadedBy,
          type:    "upload_success",
          message: `Your logo "${title}" has been submitted and is pending admin review.`,
          logoId:  newLogo._id,
        });
      }

      return NextResponse.json({ success: true, logo: newLogo, status });
    }

    // ── Folder upload ─────────────────────────────────────
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
        const fileName = `${Date.now()}-${i}-${baseName.replace(/\s+/g, "_")}`;

        const { url, publicId } = await uploadToCloudinary(buffer, fileName);

        const logo = await Logo.create({
          imageUrl:     url,
          cloudinaryId: publicId,
          title: imgTitle, desc: imgDesc,
          category: imgCategory,
          folderName, type, uploadedBy, status,
        });

        saved.push(logo);
      }

      if (!saved.length)
        return NextResponse.json({ success: false, message: "No valid images uploaded" });

      if (uploadedBy) {
        await Notification.create({
          userId:  uploadedBy,
          type:    "upload_success",
          message: `Your ${saved.length} logo(s) from "${folderName}" submitted — pending admin review.`,
        });
      }

      return NextResponse.json({ success: true, logos: saved, count: saved.length, status });
    }

    return NextResponse.json({ success: false, message: "No file provided" });

  } catch (error: any) {
    console.error("[UPLOAD ERROR]:", error);
    return NextResponse.json({
      success: false,
      message: error?.message || String(error) || "Upload failed"
    });
  }
}