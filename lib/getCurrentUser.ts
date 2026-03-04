import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import User from "@/models/User";
import { connectDB } from "./mongodb";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  console.log("getCurrentUser - token present:", !!token)

  if (!token) return null;

  try {
    await connectDB();

    // 1. Verify and decode the token
    const decoded: any = await verifyToken(token);
    console.log("getCurrentUser - decoded:", decoded)

    // 2. Use decoded.id (to match the signToken payload in jwt.ts)
    // 3. Added .select("-password") to protect sensitive data
    const user = await User.findById(decoded.id).select("-password");

    return user;
  } catch (err) {
    console.error("getCurrentUser - error:", err)
    // If token is expired or invalid, return null
    return null;
  }
}