import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Service from "@/models/Service";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { validateName, validateEmail, validatePhone } from "@/lib/validations";

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

  // 1. Validate required fields & formats
  if (!serviceId) {
    return NextResponse.json({ message: "Please select a service." }, { status: 400 });
  }

  const nameError = validateName(fullName);
  if (nameError) return NextResponse.json({ message: nameError }, { status: 400 });

  const emailError = validateEmail(email);
  if (emailError) return NextResponse.json({ message: emailError }, { status: 400 });

  const phoneError = validatePhone(phone);
  if (phoneError) return NextResponse.json({ message: phoneError }, { status: 400 });

  if (!date) {
    return NextResponse.json({ message: "Please select a date." }, { status: 400 });
  }

  // 2. Prevent booking in the past
  const bookingDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (bookingDate < today) {
    return NextResponse.json(
      { message: "Booking date cannot be in the past." },
      { status: 400 }
    );
  }

  if (!time) {
    return NextResponse.json({ message: "Please select a time." }, { status: 400 });
  }

  // 3. Sanitize notes — strip any HTML and limit length
  const sanitizedNotes = notes
    ? notes.trim().replace(/<[^>]*>/g, "").slice(0, 500)
    : undefined;

  // 4. Verify Service exists
  const service = await Service.findById(serviceId);
  if (!service) {
    return NextResponse.json({ message: "Service not found." }, { status: 404 });
  }

  const currentUser = await getCurrentUser();

  // 5. Create Booking
  const booking = await Booking.create({
    service:     serviceId,
    serviceName: service.name,
    user:        currentUser?._id || undefined,
    fullName:    fullName.trim(),
    email:       email.trim().toLowerCase(), // Normalized for consistency
    phone:       phone.trim(),
    date:        bookingDate,
    time,
    notes:       sanitizedNotes,
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