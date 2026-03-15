//app\api\products\route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const showAll = searchParams.get("all") === "true";

  if (showAll) {
    const user = await getCurrentUser();
    if (user?.role === "admin") {
      const products = await Product.find().sort({ createdAt: -1 });
      return NextResponse.json(products);
    }
  }

  // isActive: true OR isActive field doesn't exist yet (legacy products)
  const products = await Product.find({
    isActive: { $ne: false },
  }).sort({ createdAt: -1 });

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