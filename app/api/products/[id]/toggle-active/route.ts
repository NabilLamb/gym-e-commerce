//app\api\products\[id]\toggle-active\route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;
    
    const body = await request.json();
    const { isActive } = body;

    const updated = await Product.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/products/[id]/toggle-active Error:", error);
    return NextResponse.json(
      { message: "Failed to toggle product status" },
      { status: 500 }
    );
  }
}
