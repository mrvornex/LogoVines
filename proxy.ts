import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin routes
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    try {
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    } 
  }
 
  // Protected user routes
  if (["/profile", "/my-uploads", "/upload"].some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get("user_token")?.value;
    if (!token) return NextResponse.redirect(new URL("/user-login", req.url));
    try {
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/user-login", req.url));
    }
  }

  // Admin API — only admin cookie
  if (pathname.startsWith("/api/upload") || pathname.startsWith("/api/admin")) {
    // Allow user uploads via /api/upload (checked inside route)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/my-uploads/:path*", "/upload/:path*", "/api/upload/:path*", "/api/admin/:path*"],
};