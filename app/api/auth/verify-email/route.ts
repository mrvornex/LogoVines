import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail, emailWelcome } from "@/lib/email";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token)
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 400 });

    const user = await User.findOne({
      verifyToken:       token,
      verifyTokenExpiry: { $gt: new Date() }, // not expired
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Verification link is invalid or has expired.",
      }, { status: 400 });
    }

    // Activate account
    user.isVerified        = true;
    user.verifyToken       = null;
    user.verifyTokenExpiry = null;
    await user.save();

    // Send welcome email now that email is verified
    sendEmail({
      to: user.email,
      ...emailWelcome(user.name, user.username),
    }).catch(console.error);

    return NextResponse.json({ success: true, message: "Email verified successfully!" });

  } catch (error) {
    console.error("VERIFY ERROR:", error);
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}