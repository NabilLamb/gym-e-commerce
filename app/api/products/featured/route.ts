// app/api/products/featured/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "6");

  // Weighted score: reviews × rating + sales boost
  // Uses MongoDB aggregation to compute score server-side
  const products = await Product.aggregate([
    {
      $match: {
        stock: { $gt: 0 }, // only in-stock products
      },
    },
    {
      $addFields: {
        score: {
          $add: [
            // Review score: numReviews × averageRating (max contribution ~500 for 100 reviews at 5★)
            { $multiply: ["$numReviews", "$averageRating"] },
            // Sales boost: totalSold × 0.5 (safe fallback to 0 if field doesn't exist yet)
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