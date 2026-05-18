import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { jwtVerify } from "jose";

async function getUserId(req: Request): Promise<string | null> {
  const cookie = req.headers.get("cookie") || "";
  const token  = cookie.split(";").find((c) => c.trim().startsWith("user_token="))?.split("=")[1];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    return (payload as any).userId;
  } catch { return null; }
}

// GET all notifications
export async function GET(req: Request) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  await connectDB();
  const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20).lean();
  const unread = await Notification.countDocuments({ userId, read: false });
  return NextResponse.json({ success: true, notifications, unread });
}

// PATCH — mark all as read
export async function PATCH(req: Request) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  await connectDB();
  await Notification.updateMany({ userId, read: false }, { read: true });
  return NextResponse.json({ success: true });
}