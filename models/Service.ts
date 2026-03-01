import mongoose, { Schema, Document, models, model } from "mongoose"

export interface IService extends Document {
  name: string
  description: string
  price: number
  duration: string
  image: string
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
)

export default models.Service || model<IService>("Service", ServiceSchema)
