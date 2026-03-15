import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./lib/jwt"

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl

  // ── 1. Page-level protected routes ──────────────────────────
  // These are UI pages that require the user to be logged in.
  // API routes are NOT listed here — they protect themselves
  // internally via getCurrentUser() in each route handler.
  const protectedRoutes = [
    "/checkout",
    "/profile",
    "/services/booking",
    "/admin",
  ]

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // 2. Redirect unauthenticated users away from protected pages
  if (isProtected && !token) {
    const loginUrl = new URL("/auth", req.url)
    loginUrl.searchParams.set("mode", "login")
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 3. Admin pages additionally require the 'admin' role
  if (pathname.startsWith("/admin") && token) {
    try {
      const decoded: any = await verifyToken(token)

      if (!decoded) {
        return NextResponse.redirect(new URL("/auth", req.url))
      }

      if (decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url))
      }
    } catch (err) {
      console.error("Middleware: token verification error:", err)
      return NextResponse.redirect(new URL("/auth", req.url))
    }
  }

  return NextResponse.next()
}

// ── Matcher ────────────────────────────────────────────────────
// Only run middleware on UI pages that need auth protection.
// API routes handle their own auth internally — never add them here
// unless you want to block ALL methods including public GET requests.
export const config = {
  matcher: [
    "/checkout/:path*",
    "/profile/:path*",
    "/services/booking/:path*",
    "/admin/:path*",
  ],
}