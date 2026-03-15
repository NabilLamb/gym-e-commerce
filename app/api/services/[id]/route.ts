// app/api/services/[id]/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const service = await Service.findById(id).lean();
  if (!service) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  return NextResponse.json(service);
}