import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/getCurrentUser"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ success: false, message: "Not logged in" }, { status: 401 })
  return NextResponse.json({ success: true, user: { name: user.name, email: user.email, role: user.role } })
}
