//app\api\products\route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/getCurrentUser";

// GET — public: only active products | admin: all products
export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const showAll = searchParams.get("all") === "true";

  // Only admins can see inactive products
  if (showAll) {
    const user = await getCurrentUser();
    if (user?.role === "admin") {
      const products = await Product.find().sort({ createdAt: -1 });
      return NextResponse.json(products);
    }
  }

  // Everyone else: only active products
  const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const body = await req.json();
  const product = await Product.create(body);
  return NextResponse.json(product, { status: 201 });
}