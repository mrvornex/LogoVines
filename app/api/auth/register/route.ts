import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name?.trim() || !email?.trim() || !password?.trim())
      return NextResponse.json({ success: false, message: "All fields required" }, { status: 400 });

    if (password.length < 6)
      return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return NextResponse.json({ success: false, message: "Email already registered" }, { status: 409 });

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ name: name.trim(), email: email.toLowerCase(), password: hashed });

    return NextResponse.json({ success: true, message: "Account created!", userId: user._id });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}