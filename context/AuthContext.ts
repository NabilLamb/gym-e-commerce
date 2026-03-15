//context\AuthContext.ts

"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type User = {
  name: string
  email: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me")
      const data = await res.json()
      if (data.success) {
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message)

    if (data.success && data.user) {
      setUser(data.user)
    } else {
      await refreshUser()
    }
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message)

    await login(email, password)
  }

  const logout = async () => {
    // 1. Call the logout API to clear the httpOnly cookie
    await fetch("/api/auth/logout", { method: "POST" })

    // 2. Clear user state
    setUser(null)

    // 3. Clear cart from localStorage so it doesn't reload on next mount
    localStorage.removeItem("cart")

    // 4. Dispatch a custom event so CartContext clears its in-memory state immediately
    window.dispatchEvent(new Event("auth:logout"))
  }

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, login, register, logout, refreshUser } },
    children
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}