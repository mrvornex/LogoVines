import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";

async function getPayload(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const token  = cookie.split(";").find((c) => c.trim().startsWith("user_token="))?.split("=")[1];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    return payload as any;
  } catch { return null; }
}

// GET profile
export async function GET(req: Request) {
  const p = await getPayload(req);
  if (!p) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  await connectDB();
  const user = await User.findById(p.userId).select("-password").lean();
  if (!user) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, user });
}

// PATCH — update profile or password
export async function PATCH(req: Request) {
  const p = await getPayload(req);
  if (!p) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  await connectDB();

  const body = await req.json();
  const user = await User.findById(p.userId);
  if (!user) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

  // Account settings
  if (body.username !== undefined) {
    if (!/^[a-z0-9_]+$/.test(body.username))
      return NextResponse.json({ success: false, message: "Invalid username format" }, { status: 400 });
    const taken = await User.findOne({ username: body.username, _id: { $ne: user._id } });
    if (taken) return NextResponse.json({ success: false, message: "Username already taken" }, { status: 409 });
    user.username = body.username;
  }
  if (body.email !== undefined) {
    const taken = await User.findOne({ email: body.email.toLowerCase(), _id: { $ne: user._id } });
    if (taken) return NextResponse.json({ success: false, message: "Email already in use" }, { status: 409 });
    user.email = body.email.toLowerCase();
  }
  if (body.name !== undefined) user.name = body.name.trim();

  // Social links / profile settings
  const socialFields = ["country","website","facebook","twitter","instagram","pinterest","linkedin","behance","dribbble"];
  socialFields.forEach((f) => { if (body[f] !== undefined) (user as any)[f] = body[f]; });

  // Password change
  if (body.newPassword) {
    if (!body.currentPassword)
      return NextResponse.json({ success: false, message: "Current password required" }, { status: 400 });
    const match = await bcrypt.compare(body.currentPassword, user.password);
    if (!match)
      return NextResponse.json({ success: false, message: "Current password incorrect" }, { status: 400 });
    if (body.newPassword.length < 6)
      return NextResponse.json({ success: false, message: "New password must be 6+ characters" }, { status: 400 });
    user.password = await bcrypt.hash(body.newPassword, 10);
  }

  await user.save();
  return NextResponse.json({ success: true, message: "Saved successfully" });
}

// DELETE — delete account
export async function DELETE(req: Request) {
  const p = await getPayload(req);
  if (!p) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  await connectDB();
  await User.findByIdAndDelete(p.userId);
  const res = NextResponse.json({ success: true });
  res.cookies.set("user_token", "", { httpOnly: true, maxAge: 0, path: "/" });
  return res;
}