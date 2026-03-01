import mongoose, { Schema, Document, models, model } from "mongoose"

export interface IProduct extends Document {
  name: string
  category: "equipment" | "supplements" | "clothes"
  price: number
  originalPrice?: number
  image: string
  description: string
  rating: number
  reviews: number
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["equipment", "supplements", "clothes"],
      required: true,
    },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default models.Product || model<IProduct>("Product", ProductSchema)
