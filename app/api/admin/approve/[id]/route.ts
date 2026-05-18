import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import Notification from "@/models/Notification";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id }     = await params;
    const { action } = await req.json(); // "approve" | "reject"

    const logo = await Logo.findById(id);
    if (!logo) return NextResponse.json({ success: false, message: "Logo not found" }, { status: 404 });

    logo.status = action === "approve" ? "approved" : "rejected";
    await logo.save();

    // Notify user if uploaded by a user
    if (logo.uploadedBy) {
      await Notification.create({
        userId:  logo.uploadedBy,
        type:    action === "approve" ? "approved" : "rejected",
        message: action === "approve"
          ? `Your logo "${logo.title}" has been approved and is now live!`
          : `Your logo "${logo.title}" was not approved. Please review our guidelines.`,
        logoId: logo._id,
      });
    }

    return NextResponse.json({ success: true, status: logo.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}