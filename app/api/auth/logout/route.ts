//app\api\auth\logout\route.ts

import { NextResponse } from "next/server";

/**
 * Handles the Logout process.
 * We use POST to ensure the action is intentional.
 */
export async function POST() {
  const response = NextResponse.json({ 
    success: true, 
    message: "Logged out successfully" 
  });

  // Clear the 'token' cookie by setting its expiration to the past (Epoch 0)
  response.cookies.set("token", "", {
    httpOnly: true,    // Prevents client-side JS from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Only use HTTPS in production
    expires: new Date(0), // Forces the browser to delete the cookie immediately
    path: "/",        // Ensures the cookie is cleared for the entire site
  });

  return response;
}

/**
 * Blocking GET requests to this route as per teacher's instruction.
 * Checking current user status should be done via the /api/auth/me route.
 */
export async function GET() {
  return NextResponse.json(
    { message: "Method not allowed. Please use POST to logout." }, 
    { status: 405 }
  );
}