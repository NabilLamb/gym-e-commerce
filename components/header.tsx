"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Menu, X, Moon, Sun, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"   // import useCart

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { user, loading, logout } = useAuth()
  const { totalItems } = useCart()   // get totalItems from cart

  useEffect(() => setMounted(true), [])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex h-16 max-w-7xl items-center justify-between mx-auto px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">F</div>
          <span className="hidden sm:inline">FitHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">Products</Link>
          <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">Services</Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {!mounted ? <div className="h-4 w-4" /> : theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Cart */}
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {/* Auth Section */}
          {!loading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {user.name?.charAt(0).toUpperCase() || <User size={16} />}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2 text-sm">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-muted-foreground text-xs">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/auth?mode=login" className="text-sm font-medium hover:text-primary transition-colors">Sign In</Link>
                <Link href="/auth?mode=register"><Button size="sm">Sign Up</Button></Link>
              </div>
            )
          )}

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="flex flex-col">
            <Link href="/" className="px-4 py-3 text-sm border-b">Home</Link>
            <Link href="/products" className="px-4 py-3 text-sm border-b">Products</Link>
            <Link href="/services" className="px-4 py-3 text-sm border-b">Services</Link>
            {user ? (
              <>
                {user.role === "admin" && <Link href="/admin" className="px-4 py-3 text-sm border-b">Dashboard</Link>}
                <Link href="/profile" className="px-4 py-3 text-sm border-b">Profile</Link>
                <button onClick={handleLogout} className="px-4 py-3 text-sm text-red-500 text-left">Logout</button>
              </>
            ) : (
              <>
                <Link href="/auth?mode=login" className="px-4 py-3 text-sm border-b">Sign In</Link>
                <Link href="/auth?mode=register" className="px-4 py-3 text-sm">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}