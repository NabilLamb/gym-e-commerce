// models/Booking.ts

import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IBooking extends Document {
  service: mongoose.Types.ObjectId;
  serviceName: string;
  user?: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no-show";
  checkInCode: string;
  createdAt: Date;
  updatedAt: Date;
}

function generateCheckInCode(): string {
  return "FH-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

const BookingSchema = new Schema<IBooking>(
  {
    service:     { type: Schema.Types.ObjectId, ref: "Service", required: true },
    serviceName: { type: String, required: true },
    user:        { type: Schema.Types.ObjectId, ref: "User" },
    fullName:    { type: String, required: true, trim: true },
    email:       { type: String, required: true, trim: true },
    phone:       { type: String, required: true, trim: true },
    date:        { type: Date, required: true },
    time:        { type: String, required: true },
    notes:       { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "no-show"],
      default: "pending",
    },
    checkInCode: {
      type: String,
      default: generateCheckInCode,
      unique: true,
    },
  },
  { timestamps: true }
);

export default models.Booking || model<IBooking>("Booking", BookingSchema);