import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function middleware(req: NextRequest) {
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

  // User protected routes
  if (["/profile", "/my-uploads", "/upload", "/dashboard"].some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get("user_token")?.value;
    if (!token) return NextResponse.redirect(new URL("/user-login", req.url));
    try {
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/user-login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/my-uploads/:path*",
    "/upload/:path*",
    "/dashboard/:path*",
  ],
};