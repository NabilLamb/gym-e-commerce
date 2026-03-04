// app/api/cart/validate/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ validIds: [] });
    }

    // Find all products that still exist AND are in stock
    const existingProducts = await Product.find(
      { _id: { $in: ids }, stock: { $gt: 0 } },
      { _id: 1 } // only return the _id field
    ).lean();

    const validIds = existingProducts.map((p) => p._id.toString());

    return NextResponse.json({ validIds });
  } catch (err) {
    console.error("Cart validation error:", err);
    return NextResponse.json({ validIds: [] }, { status: 500 });
  }
}