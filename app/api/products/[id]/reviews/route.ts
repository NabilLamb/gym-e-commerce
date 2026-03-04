// app/api/products/[id]/reviews/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/getCurrentUser";

// GET /api/products/[id]/reviews — fetch all reviews for a product
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();

  const reviews = await Review.find({ product: id })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(reviews);
}

// PUT /api/products/[id]/reviews — edit existing review (auth required)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { message: "You must be signed in to edit a review." },
      { status: 401 }
    );
  }

  const { id } = await params;
  await connectDB();

  const { rating, comment } = await req.json();

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json(
      { message: "Rating must be between 1 and 5." },
      { status: 400 }
    );
  }
  if (!comment || comment.trim().length < 5) {
    return NextResponse.json(
      { message: "Comment must be at least 5 characters." },
      { status: 400 }
    );
  }

  const review = await Review.findOne({ product: id, user: user._id });
  if (!review) {
    return NextResponse.json(
      { message: "Review not found." },
      { status: 404 }
    );
  }

  review.rating = rating;
  review.comment = comment.trim();
  review.edited = true;
  await review.save();

  // Recalculate product averageRating
  const allReviews = await Review.find({ product: id });
  const numReviews = allReviews.length;
  const averageRating =
    allReviews.reduce((acc, r) => acc + r.rating, 0) / numReviews;

  await Product.findByIdAndUpdate(id, {
    averageRating: Math.round(averageRating * 10) / 10,
    numReviews,
  });

  return NextResponse.json(review);
}
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { message: "You must be signed in to leave a review." },
      { status: 401 }
    );
  }

  const { id } = await params;
  await connectDB();

  const { rating, comment } = await req.json();

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json(
      { message: "Rating must be between 1 and 5." },
      { status: 400 }
    );
  }
  if (!comment || comment.trim().length < 5) {
    return NextResponse.json(
      { message: "Comment must be at least 5 characters." },
      { status: 400 }
    );
  }

  // Check if user already reviewed this product
  const existing = await Review.findOne({ product: id, user: user._id });
  if (existing) {
    return NextResponse.json(
      { message: "You have already reviewed this product." },
      { status: 409 }
    );
  }

  // Create review
  const review = await Review.create({
    product: id,
    user: user._id,
    userName: user.name || user.email,
    userImage: user.image || null,
    rating,
    comment: comment.trim(),
  });

  // Recalculate product averageRating and numReviews
  const allReviews = await Review.find({ product: id });
  const numReviews = allReviews.length;
  const averageRating =
    allReviews.reduce((acc, r) => acc + r.rating, 0) / numReviews;

  await Product.findByIdAndUpdate(id, {
    averageRating: Math.round(averageRating * 10) / 10,
    numReviews,
  });

  return NextResponse.json(review, { status: 201 });
}