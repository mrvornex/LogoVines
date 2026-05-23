import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import { deleteFromCloudinary, getPublicIdFromUrl } from "@/lib/cloudinary";

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

    // Delete from Cloudinary
    const publicId = logo.cloudinaryId || getPublicIdFromUrl(logo.imageUrl);
    await deleteFromCloudinary(publicId);

    // Delete from DB
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

    const { id }                    = await params;
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