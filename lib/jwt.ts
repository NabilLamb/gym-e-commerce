//lib\jwt.ts

import { SignJWT, jwtVerify } from 'jose'

// Don't throw at module level — check at runtime instead
const getSecret = (): Uint8Array => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not defined")
  }
  return new TextEncoder().encode(secret)
}

export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret())
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload
  } catch (error) {
    console.error("JWT Verification failed:", error)
    return null
  }
}