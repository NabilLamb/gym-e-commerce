// models/Order.ts

import mongoose, { Schema, models, model, Document } from "mongoose";

export interface IOrder extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: Array<{
    productId: mongoose.Types.ObjectId;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    zip: string;
    country: string;
  };
  paymentMethod: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

function generateOrderNumber(): string {
  return "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      default: generateOrderNumber,
      unique: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name:      { type: String, required: true },
        image:     { type: String, default: "" },
        price:     { type: Number, required: true },
        quantity:  { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    shippingAddress: {
      fullName: { type: String, required: true },
      address:  { type: String, required: true },
      city:     { type: String, required: true },
      zip:      { type: String, required: true },
      country:  { type: String, required: true },
    },
    paymentMethod: { type: String, default: "card" },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default models.Order || model<IOrder>("Order", OrderSchema);