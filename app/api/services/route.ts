import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Service from "@/models/Service"

// GET all services
export async function GET() {
  await connectDB()
  const services = await Service.find().sort({ createdAt: -1 })
  return NextResponse.json(services)
}

// POST create service
export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()

  const service = await Service.create(body)

  return NextResponse.json(service, { status: 201 })
}

// DELETE service
export async function DELETE(req: Request) {
  await connectDB()
  const { id } = await req.json()

  await Service.findByIdAndDelete(id)

  return NextResponse.json({ message: "Service deleted" })
}

// PUT update service
export async function PUT(req: Request) {
  await connectDB()
  const { id, ...data } = await req.json()

  const updated = await Service.findByIdAndUpdate(id, data, { new: true })

  return NextResponse.json(updated)
}
