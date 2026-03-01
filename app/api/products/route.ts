import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Product from "@/models/Product"
import { getCurrentUser } from "@/lib/getCurrentUser"

export async function GET() {
  await connectDB()
  const products = await Product.find().sort({ createdAt: -1 })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  }

  await connectDB()
  const body = await req.json()
  const product = await Product.create(body)
  return NextResponse.json(product, { status: 201 })
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  }

  await connectDB()
  const { id } = await req.json()
  await Product.findByIdAndDelete(id)
  return NextResponse.json({ message: "Product deleted" })
}

export async function PUT(req: Request) {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  }

  await connectDB()
  const { id, ...data } = await req.json()
  const updated = await Product.findByIdAndUpdate(id, data, { new: true })
  return NextResponse.json(updated)
}