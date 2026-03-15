// models/Service.ts

import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IService extends Document {
  name: string;
  description: string;
  price: number;
  duration: string;
  category: "personal-training" | "group-class" | "facility-access" | "assessment" | "online-coaching";
  capacity: number;
  location: string;
  image: string;
  isActive: boolean;
  includes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true, min: 0 },
    duration:    { type: String, required: true },
    category: {
      type: String,
      enum: ["personal-training", "group-class", "facility-access", "assessment", "online-coaching"],
      default: "personal-training",
    },
    capacity: { type: Number, required: true, min: 1, default: 1 },
    location: { type: String, required: true, default: "Main Floor" },
    image:    { type: String, required: true },
    isActive: { type: Boolean, default: true },
    includes: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default models.Service || model<IService>("Service", ServiceSchema);