import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin and /api/upload
  const isAdminPage  = pathname.startsWith("/admin");
  const isUploadAPI  = pathname.startsWith("/api/upload");

  if (!isAdminPage && !isUploadAPI) {
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    // Redirect to login for page requests
    if (isAdminPage) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Return 401 for API requests
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    // Token invalid or expired
    if (isAdminPage) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.json(
      { success: false, message: "Session expired. Please login again." },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/upload/:path*"],
};