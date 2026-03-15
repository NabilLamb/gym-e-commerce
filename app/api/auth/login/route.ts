//app\api\auth\login\route.ts

import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { signToken } from "@/lib/jwt"
import { validateEmail } from "@/lib/validations"

export async function POST(req: Request) {
  try {
    await connectDB()

    const { email, password } = await req.json()

    // Basic presence check
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      )
    }

    // Validate email format
    const emailError = validateEmail(email)
    if (emailError) {
      return NextResponse.json({ message: emailError }, { status: 400 })
    }

    // Password length sanity check — prevent bcrypt DoS attack
    // bcrypt silently truncates passwords over 72 bytes
    if (typeof password !== "string" || password.length > 100) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 }
      )
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() })

    // Always run bcrypt compare even if user not found
    // This prevents timing attacks that reveal whether an email exists
    const dummyHash = "$2b$12$invalidhashfortimingnormalization000000000000000000000"
    const isMatch = user
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, dummyHash)

    if (!user || !isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      )
    }

    const token = await signToken({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    })

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      user: userData,
    })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { message: "Login failed. Please try again." },
      { status: 500 }
    )
  }
}