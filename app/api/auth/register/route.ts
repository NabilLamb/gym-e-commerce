//app\api\auth\register\route.ts

import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { validateName, validateEmail, validatePassword } from "@/lib/validations"

export async function POST(req: Request) {
  try {
    await connectDB()

    const { name, email, password } = await req.json()

    // Validate all fields
    const nameError = validateName(name)
    if (nameError) {
      return NextResponse.json({ message: nameError }, { status: 400 })
    }

    const emailError = validateEmail(email)
    if (emailError) {
      return NextResponse.json({ message: emailError }, { status: 400 })
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      return NextResponse.json({ message: passwordError }, { status: 400 })
    }

    // Check existing user
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12) // increased from 10 to 12

    await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    })

    return NextResponse.json({
      success: true,
      message: "Account created successfully.",
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { message: "Registration failed. Please try again." },
      { status: 500 }
    )
  }
}