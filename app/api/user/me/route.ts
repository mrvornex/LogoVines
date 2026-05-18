import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const token  = cookie.split(";").find((c) => c.trim().startsWith("user_token="))?.split("=")[1];
  if (!token) return NextResponse.json({ user: null });
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    const p = payload as any;
    return NextResponse.json({
      user: { id: p.userId, name: p.name, username: p.username, email: p.email }
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}