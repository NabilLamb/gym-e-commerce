// app/api/bookings/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Service from "@/models/Service";
import { getCurrentUser } from "@/lib/getCurrentUser";

// GET — admin: all bookings | user: their own bookings
export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const query = user.role === "admin" ? {} : { user: user._id };
  const bookings = await Booking.find(query)
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(bookings);
}

// POST — create a booking (anyone)
export async function POST(req: Request) {
  await connectDB();

  const { serviceId, fullName, email, phone, date, time, notes } = await req.json();

  if (!serviceId || !fullName || !email || !phone || !date || !time) {
    return NextResponse.json(
      { message: "All required fields must be filled." },
      { status: 400 }
    );
  }

  const service = await Service.findById(serviceId);
  if (!service) {
    return NextResponse.json({ message: "Service not found." }, { status: 404 });
  }

  const currentUser = await getCurrentUser();

  const booking = await Booking.create({
    service:     serviceId,
    serviceName: service.name,
    user:        currentUser?._id || undefined,
    fullName:    fullName.trim(),
    email:       email.trim(),
    phone:       phone.trim(),
    date:        new Date(date),
    time,
    notes:       notes?.trim() || undefined,
    status:      "pending",
  });

  return NextResponse.json(booking, { status: 201 });
}

// PATCH — update booking status (admin only)
export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const { id, status } = await req.json();

  const validStatuses = ["pending", "confirmed", "completed", "cancelled", "no-show"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ message: "Invalid status." }, { status: 400 });
  }

  const updated = await Booking.findByIdAndUpdate(id, { status }, { new: true });
  if (!updated) {
    return NextResponse.json({ message: "Booking not found." }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// DELETE — admin only
export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const { id } = await req.json();
  await Booking.findByIdAndDelete(id);

  return NextResponse.json({ message: "Booking deleted" });
}