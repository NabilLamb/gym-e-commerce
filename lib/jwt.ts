//lib\jwt.ts

import { SignJWT, jwtVerify } from 'jose'

// 1. Get the secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in your environment variables")
}

// 2. jose requires the secret to be encoded as a Uint8Array
const secretKey = new TextEncoder().encode(JWT_SECRET)

/**
 * Creates a signed JWT token
 */
export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' }) // Define the algorithm
    .setIssuedAt()
    .setExpirationTime('7d') // Set expiration
    .sign(secretKey)         // Sign with our encoded secret
}

/**
 * Verifies a JWT token and returns the payload
 */
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload
  } catch (error) {
    // Returns null or throws if the token is expired/invalid
    console.error("JWT Verification failed:", error)
    return null
  }
}