import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail, emailVerification } from "@/lib/email";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, username, email, password } = await req.json();

    if (!name?.trim())     return NextResponse.json({ success: false, message: "Name is required" },     { status: 400 });
    if (!username?.trim()) return NextResponse.json({ success: false, message: "Username is required" }, { status: 400 });
    if (!email?.trim())    return NextResponse.json({ success: false, message: "Email is required" },    { status: 400 });
    if (!password?.trim()) return NextResponse.json({ success: false, message: "Password is required" }, { status: 400 });
    if (password.length < 6)
      return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });

    const cleanUsername = username.toLowerCase().trim();
    if (!/^[a-z0-9_]+$/.test(cleanUsername))
      return NextResponse.json({ success: false, message: "Username: only letters, numbers, underscores" }, { status: 400 });

    const existingEmail    = await User.findOne({ email: email.toLowerCase().trim() });
    const existingUsername = await User.findOne({ username: cleanUsername });

    if (existingEmail)    return NextResponse.json({ success: false, message: "This email is already registered" },  { status: 409 });
    if (existingUsername) return NextResponse.json({ success: false, message: "This username is already taken" },    { status: 409 });

    const hashed = await bcrypt.hash(password, 10);

    // Generate verification token
    const verifyToken       = crypto.randomBytes(32).toString("hex");
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await User.create({
      name:     name.trim(),
      username: cleanUsername,
      email:    email.toLowerCase().trim(),
      password: hashed,
      isVerified:        false,
      verifyToken,
      verifyTokenExpiry,
    });

    // Send verification email
    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email?token=${verifyToken}`;

    sendEmail({
      to: email.toLowerCase().trim(),
      ...emailVerification(name.trim(), verifyUrl),
    }).catch((err) => console.error("[VERIFY EMAIL ERROR]:", err));

    return NextResponse.json({
      success: true,
      message: "Account created! Please check your email to verify your account.",
    });

  } catch (error: any) {
    console.error("REGISTER ERROR:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      return NextResponse.json({
        success: false,
        message: field === "email" ? "Email already registered" : "Username already taken",
      }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: "Server error: " + error.message }, { status: 500 });
  }
}