import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Read and decrypt the JWT session token in the Edge Runtime
  const token = await getToken({ 
    req, 
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET 
  });
  
  const isLoggedIn = !!token;
  const role = token?.role as string | undefined;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    const hasAdminRole = ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR", "COURSE_MANAGER"].includes(role || "");
    if (!hasAdminRole) {
      // Redirect back to home if not authorized admin
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
  }

  return NextResponse.next();
}

// Match all administrative routes
export const config = {
  matcher: ["/admin/:path*"],
};
