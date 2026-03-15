// models/Product.ts

import mongoose, { Schema, models, model, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  category: "equipment" | "supplements" | "clothes";
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  video?: string;
  stock: number;
  variants?: Array<{
    size?: string;
    color?: string;
    stock: number;
    sku?: string;
  }>;
  averageRating: number;
  numReviews: number;
  totalSold: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["equipment", "supplements", "clothes"],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    video: { type: String },
    stock: { type: Number, required: true, min: 0, default: 0 },
    variants: [
      {
        size: String,
        color: String,
        stock: { type: Number, required: true, min: 0 },
        sku: String,
      },
    ],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 },
    totalSold: { type: Number, default: 0, min: 0 }, // ← new field
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.pre<IProduct>("save", async function () {
  if (this.originalPrice && this.originalPrice <= this.price) {
    throw new Error("Original price must be greater than current price");
  }
});

const Product = models.Product || model<IProduct>("Product", ProductSchema);
export default Product;