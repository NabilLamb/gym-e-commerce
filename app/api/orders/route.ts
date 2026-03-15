// app/api/orders/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/getCurrentUser";

// GET — admin: all orders | user: their own orders
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const query = user.role === "admin" ? {} : { user: user._id };
  const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

  return NextResponse.json(orders);
}

// POST — place a new order (must be logged in)
export async function POST(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ message: "You must be logged in to place an order." }, { status: 401 });
  }

  await connectDB();

  const { items, total, shippingAddress, paymentMethod } = await req.json();

  if (!items?.length || !total || !shippingAddress) {
    return NextResponse.json({ message: "Missing required order fields." }, { status: 400 });
  }

  const order = await Order.create({
    user: currentUser._id,
    items,
    total,
    shippingAddress,
    paymentMethod: paymentMethod || "card",
    status: "pending",
  });

  return NextResponse.json(order, { status: 201 });
}

// PATCH — update order status (admin only)
export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const { id, status } = await req.json();

  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ message: "Invalid status." }, { status: 400 });
  }

  const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });
  if (!updated) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
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
  await Order.findByIdAndDelete(id);

  return NextResponse.json({ message: "Order deleted" });
}