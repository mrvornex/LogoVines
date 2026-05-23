import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import fs from "fs";
import path from "path";

// ── DELETE ──────────────────────────────────────────────────
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const logo    = await Logo.findById(id);

    if (!logo) {
      return NextResponse.json(
        { success: false, message: "Logo not found" },
        { status: 404 }
      );
    }

    // Try to delete file — skip if read-only (Vercel) or not found
    try {
      const filePath = path.join(process.cwd(), "public", logo.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fileErr) {
      console.warn("[DELETE] File not deleted (read-only fs):", fileErr);
    }

    // Always delete from DB
    await Logo.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Logo deleted" });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500 }
    );
  }
}

// ── EDIT (PATCH) ─────────────────────────────────────────────
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id }              = await params;
    const { title, desc, category } = await req.json();

    if (!title?.trim() || !desc?.trim()) {
      return NextResponse.json(
        { success: false, message: "Title and description are required" },
        { status: 400 }
      );
    }

    const updated = await Logo.findByIdAndUpdate(
      id,
      { title: title.trim(), desc: desc.trim(), category: category || "Uncategorized" },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Logo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, logo: updated });

  } catch (error) {
    console.error("EDIT ERROR:", error);
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500 }
    );
  }
}