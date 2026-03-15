// app/api/services/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const showAll = searchParams.get("all") === "true";

  // Only admins can see inactive services
  if (showAll) {
    const user = await getCurrentUser();
    if (user?.role === "admin") {
      const services = await Service.find().sort({ createdAt: -1 });
      return NextResponse.json(services);
    }
  }

  // Everyone else: only active services
  const services = await Service.find({ isActive: true }).sort({ createdAt: -1 });
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const service = await Service.create(body);
  return NextResponse.json(service, { status: 201 });
}

export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();
  await Service.findByIdAndDelete(id);
  return NextResponse.json({ message: "Service deleted" });
}

export async function PUT(req: Request) {
  await connectDB();
  const { id, ...data } = await req.json();
  const updated = await Service.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updated);
}