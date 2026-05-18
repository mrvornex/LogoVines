import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email?.trim() || !password?.trim())
      return NextResponse.json({ success: false, message: "All fields required" }, { status: 400 });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token  = await new SignJWT({
      userId:   user._id.toString(),
      name:     user.name,
      username: user.username,
      email:    user.email,
      role:     user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json({
      success: true,
      user: { id: user._id.toString(), name: user.name, username: user.username, email: user.email },
    });

    response.cookies.set("user_token", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   60 * 60 * 24 * 7,
      path:     "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}