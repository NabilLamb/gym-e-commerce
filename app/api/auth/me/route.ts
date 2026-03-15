// app/api/auth/me/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/getCurrentUser";
import User from "@/models/User";
import { validateName } from "@/lib/validations";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json({
      success: true,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// PATCH — update user's name
export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const { name } = await req.json();

    const nameError = validateName(name);
    if (nameError) {
      return NextResponse.json(
        { success: false, message: nameError },
        { status: 400 }
      );
    }

    await connectDB();
    
    const updatedUser = await User.findByIdAndUpdate(
      user._id, 
      { name: name.trim() },
      { new: true } // returns the updated document
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}