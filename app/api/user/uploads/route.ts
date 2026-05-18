import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
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

export async function GET(req: Request) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  await connectDB();
  const logos = await Logo.find({ uploadedBy: userId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ success: true, logos });
}