//app\api\auth\login\route.ts

import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { signToken } from "@/lib/jwt"

export async function POST(req: Request) {
    try {
        await connectDB()

        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            )
        }

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            )
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            )
        }

        // --- CRITICAL CHANGE START ---
        // We MUST add 'await' here because signToken is now an async function
        const token = await signToken({
            id: user._id.toString(), // Added .toString() for better compatibility
            role: user.role,
            email: user.email,
        })
        // --- CRITICAL CHANGE END ---

        // Prepare user data for the frontend
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }

        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            user: userData, 
        })

        // Set the cookie using the awaited token string
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        })

        return response
    } catch (error) {
        console.error("Login Error:", error)
        return NextResponse.json(
            { message: "Login failed" },
            { status: 500 }
        )
    }
}