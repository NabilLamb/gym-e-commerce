// app/api/products/featured/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "6");

  const products = await Product.aggregate([
    {
      $match: {
        stock: { $gt: 0 },
        isActive: true, // ← add this line
      },
    },
    {
      $addFields: {
        score: {
          $add: [
            { $multiply: ["$numReviews", "$averageRating"] },
            { $multiply: [{ $ifNull: ["$totalSold", 0] }, 0.5] },
          ],
        },
      },
    },
    { $sort: { score: -1 } },
    { $limit: limit },
    {
      $project: {
        name: 1,
        category: 1,
        price: 1,
        originalPrice: 1,
        images: 1,
        description: 1,
        averageRating: 1,
        numReviews: 1,
        stock: 1,
        totalSold: 1,
        score: 1,
      },
    },
  ]);

  return NextResponse.json(products);
}