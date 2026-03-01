import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Order from "@/models/Order"
import { getCurrentUser } from "@/lib/getCurrentUser"

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  await connectDB()
  const body = await req.json()

  const order = await Order.create({
    user: user._id,
    ...body,
  })

  return NextResponse.json(order, { status: 201 })
}