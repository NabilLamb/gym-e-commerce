import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Booking from "@/models/Booking"

// GET all bookings (populate service)
export async function GET() {
  await connectDB()
  const bookings = await Booking.find()
    .populate("service")
    .sort({ createdAt: -1 })

  return NextResponse.json(bookings)
}

// POST create booking
export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()

  const booking = await Booking.create(body)

  return NextResponse.json(booking, { status: 201 })
}

// DELETE booking
export async function DELETE(req: Request) {
  await connectDB()
  const { id } = await req.json()

  await Booking.findByIdAndDelete(id)

  return NextResponse.json({ message: "Booking deleted" })
}

// PUT update booking status
export async function PUT(req: Request) {
  await connectDB()
  const { id, status } = await req.json()

  const updated = await Booking.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  )

  return NextResponse.json(updated)
}
