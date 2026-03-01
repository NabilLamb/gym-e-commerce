import mongoose, { Schema, Document, models, model } from "mongoose"

export interface IBooking extends Document {
  service: mongoose.Types.ObjectId
  date: Date
  time: string
  status: "completed" | "upcoming" | "cancelled"
}

const BookingSchema = new Schema<IBooking>(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["completed", "upcoming", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
)

export default models.Booking || model<IBooking>("Booking", BookingSchema)
