//components\header.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
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
import { useCart } from "@/context/CartContext"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { user, loading, logout } = useAuth()
  const { totalItems } = useCart()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "backdrop-blur-md bg-background/80 border-b border-border shadow-sm" : "bg-background border-b border-transparent"}`}>
      <div className="container flex h-16 max-w-7xl items-center justify-between mx-auto px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl cursor-pointer">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">F</div>
          <span className="hidden sm:inline tracking-tight">FitHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className={`text-sm font-semibold transition-colors cursor-pointer ${pathname === "/" ? "text-primary underline underline-offset-4" : "text-muted-foreground hover:text-foreground"}`}>Home</Link>
          <Link href="/products" className={`text-sm font-semibold transition-colors cursor-pointer ${pathname === "/products" ? "text-primary underline underline-offset-4" : "text-muted-foreground hover:text-foreground"}`}>Products</Link>
          <Link href="/services" className={`text-sm font-semibold transition-colors cursor-pointer ${pathname === "/services" ? "text-primary underline underline-offset-4" : "text-muted-foreground hover:text-foreground"}`}>Services</Link>
          {/* Added Contact Link */}
          <Link href="/contact" className={`text-sm font-semibold transition-colors cursor-pointer ${pathname === "/contact" ? "text-primary underline underline-offset-4" : "text-muted-foreground hover:text-foreground"}`}>Contact</Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" className="cursor-pointer hover:bg-[#FF531A] hover:text-white transition-colors" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {!mounted ? <div className="h-4 w-4" /> : theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Cart */}
          <Link href="/cart" className="relative cursor-pointer">
            <Button variant="ghost" size="icon" className="cursor-pointer hover:bg-[#FF531A] hover:text-white transition-colors">
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
                  <button className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold cursor-pointer hover:opacity-90 transition-opacity">
                    {user.name?.charAt(0).toUpperCase() || <User size={16} />}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 z-50 animate-in fade-in-0 zoom-in-95 border-border/50">
                  <div className="px-3 py-2 text-sm">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-muted-foreground text-xs">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-border/50" />
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild className={`cursor-pointer focus:bg-zinc-100 dark:focus:bg-white/5 ${pathname === "/admin" ? "text-primary" : ""}`}>
                      <Link href="/admin">Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild className={`cursor-pointer focus:bg-zinc-100 dark:focus:bg-white/5 ${pathname === "/profile" ? "text-primary" : ""}`}>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:text-red-600 focus:text-red-600 cursor-pointer focus:bg-zinc-100 dark:focus:bg-white/5">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/auth?mode=login" className="text-sm font-semibold hover:text-primary transition-colors cursor-pointer">Sign In</Link>
                <Link href="/auth?mode=register" className="cursor-pointer"><Button size="sm" className="cursor-pointer">Sign Up</Button></Link>
              </div>
            )
          )}

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden cursor-pointer hover:bg-[#FF531A] hover:text-white transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background shadow-lg">
          <nav className="flex flex-col">
            <Link href="/" className={`px-4 py-3 text-sm font-medium border-b border-border/50 ${pathname === "/" ? "text-primary" : ""}`} onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/products" className={`px-4 py-3 text-sm font-medium border-b border-border/50 ${pathname === "/products" ? "text-primary" : ""}`} onClick={() => setMobileMenuOpen(false)}>Products</Link>
            <Link href="/services" className={`px-4 py-3 text-sm font-medium border-b border-border/50 ${pathname === "/services" ? "text-primary" : ""}`} onClick={() => setMobileMenuOpen(false)}>Services</Link>
            {/* Added Contact Link to Mobile Menu */}
            <Link href="/contact" className={`px-4 py-3 text-sm font-medium border-b border-border/50 ${pathname === "/contact" ? "text-primary" : ""}`} onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            
            {user ? (
              <>
                {user.role === "admin" && <Link href="/admin" className={`px-4 py-3 text-sm font-medium border-b border-border/50 ${pathname === "/admin" ? "text-primary" : ""}`} onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>}
                <Link href="/profile" className={`px-4 py-3 text-sm font-medium border-b border-border/50 ${pathname === "/profile" ? "text-primary" : ""}`} onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="px-4 py-3 text-sm font-medium text-red-500 text-left border-b border-border/50">Logout</button>
              </>
            ) : (
              <>
                <Link href="/auth?mode=login" className="px-4 py-3 text-sm font-medium border-b border-border/50" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link href="/auth?mode=register" className="px-4 py-3 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}