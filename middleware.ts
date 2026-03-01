import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./lib/jwt"

// Added 'async' to the function signature
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl

  // 1. Define all routes that require the user to be logged in
  const protectedRoutes = ["/checkout", "/profile", "/services/booking", "/admin"]
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

  // 2. If trying to access a protected route without a token
  if (isProtected && !token) {
    const loginUrl = new URL("/auth", req.url)
    loginUrl.searchParams.set("mode", "login")
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 3. Special Check: Admin routes require the 'admin' role
  if (pathname.startsWith("/admin") && token) {
    try {
      // CRITICAL: Added 'await' because verifyToken is now async
      const decoded: any = await verifyToken(token)

      // If token is invalid (jose might return null based on our previous step)
      if (!decoded) {
        return NextResponse.redirect(new URL("/auth", req.url))
      }

      console.log("Middleware: token verified, role =", decoded.role)
      
      if (decoded.role !== "admin") {
        console.log("Middleware: role not admin, redirecting to home")
        return NextResponse.redirect(new URL("/", req.url))
      }
    } catch (err) {
      console.error("Middleware: token verification error:", err)
      return NextResponse.redirect(new URL("/auth", req.url))
    }
  }

  return NextResponse.next()
}

// 4. Matcher tells Next.js which routes should trigger this middleware
export const config = {
  matcher: ["/checkout/:path*", "/profile/:path*", "/services/booking/:path*", "/admin/:path*"],
}