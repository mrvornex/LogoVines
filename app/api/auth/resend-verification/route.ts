import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import { sendEmail, emailVerification } from "@/lib/email";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email?.trim())
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success — don't reveal if email exists
    if (!user || user.isVerified) {
      return NextResponse.json({ success: true, message: "If this email exists and is unverified, a new link has been sent." });
    }

    // Generate new token
    const verifyToken       = crypto.randomBytes(32).toString("hex");
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verifyToken       = verifyToken;
    user.verifyTokenExpiry = verifyTokenExpiry;
    await user.save();

    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email?token=${verifyToken}`;
    await sendEmail({ to: user.email, ...emailVerification(user.name, verifyUrl) });

    return NextResponse.json({ success: true, message: "✓ Verification email sent! Check your inbox." });

  } catch (error) {
    console.error("RESEND ERROR:", error);
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}