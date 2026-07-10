import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Logged in user ko login/signup page nahi dikhna chahiye
  if (pathname === "/user-login" || pathname === "/signup") {
    const token = req.cookies.get("user_token")?.value;
    if (token) return NextResponse.redirect(new URL("/", req.url));
  }

  // Admin routes
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    return NextResponse.next();
  }

  // User protected routes
  if (["/profile", "/my-uploads", "/upload", "/dashboard"].some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get("user_token")?.value;
    if (!token) return NextResponse.redirect(new URL("/user-login", req.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user-login",
    "/signup",
    "/admin/:path*",
    "/profile/:path*",
    "/my-uploads/:path*",
    "/upload/:path*",
    "/dashboard/:path*",
  ],
};