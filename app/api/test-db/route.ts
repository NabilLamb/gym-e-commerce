import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

export async function GET() {
  try {
    await connectDB()

    return NextResponse.json({
      success: true,
      message: "✅ MongoDB connected successfully",
    })
  } catch (error) {
    console.error("DB Connection Error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "❌ Failed to connect to MongoDB",
      },
      { status: 500 }
    )
  }
}
