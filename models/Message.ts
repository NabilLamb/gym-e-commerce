import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, trim: true },
    subject:   { type: String, required: true, trim: true },
    message:   { type: String, required: true, trim: true },
    isRead:    { type: Boolean, default: false },
    repliedAt: { type: Date },
  },
  { timestamps: true }
);

export default models.Message || model<IMessage>("Message", MessageSchema);