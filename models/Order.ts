import mongoose, { Schema, models, model } from "mongoose"

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: { type: Number, required: true },
    shippingAddress: {
      address: String,
      city: String,
      zip: String,
    },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "shipped", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
)

export default models.Order || model("Order", OrderSchema)