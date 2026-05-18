import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, username, email, password } = await req.json();

    if (!name?.trim() || !username?.trim() || !email?.trim() || !password?.trim())
      return NextResponse.json({ success: false, message: "All fields required" }, { status: 400 });

    if (password.length < 6)
      return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });

    if (!/^[a-z0-9_]+$/.test(username.toLowerCase()))
      return NextResponse.json({ success: false, message: "Username can only contain letters, numbers, underscores" }, { status: 400 });

    const existingEmail    = await User.findOne({ email: email.toLowerCase() });
    const existingUsername = await User.findOne({ username: username.toLowerCase() });

    if (existingEmail)    return NextResponse.json({ success: false, message: "Email already registered" }, { status: 409 });
    if (existingUsername) return NextResponse.json({ success: false, message: "Username already taken" }, { status: 409 });

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({
      name: name.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
    });

    return NextResponse.json({ success: true, message: "Account created!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}