import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { sendEmail, emailApproved, emailRejected } from "@/lib/email";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id }     = await params;
    const { action } = await req.json();

    const logo = await Logo.findById(id);
    if (!logo)
      return NextResponse.json({ success: false, message: "Logo not found" }, { status: 404 });

    logo.status = action === "approve" ? "approved" : "rejected";
    await logo.save();

    // Notify user if uploaded by a user
    if (logo.uploadedBy) {
      // In-app notification
      await Notification.create({
        userId:  logo.uploadedBy,
        type:    action === "approve" ? "approved" : "rejected",
        message: action === "approve"
          ? `Your logo "${logo.title}" has been approved and is now live!`
          : `Your logo "${logo.title}" was not approved. Please review our guidelines.`,
        logoId: logo._id,
      });

      // Email notification
      const user = await User.findById(logo.uploadedBy).select("name email").lean() as any;
      if (user?.email) {
        const template = action === "approve"
          ? emailApproved(user.name, logo.title, logo._id.toString())
          : emailRejected(user.name, logo.title);

        await sendEmail({ to: user.email, ...template });
      }
    }

    // Revalidate so approved logo shows immediately
    revalidatePath("/");
    revalidatePath("/logos");
    revalidatePath("/category/all");

    return NextResponse.json({ success: true, status: logo.status });

  } catch (error) {
    console.error("APPROVE ERROR:", error);
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}  