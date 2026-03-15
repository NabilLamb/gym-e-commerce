import Link from 'next/link'
import { Facebook, Instagram, Twitter, Linkedin, ArrowRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t-2 border-[#FF531A] bg-zinc-950 text-zinc-400 py-16 relative overflow-hidden">
      {/* Subtle Glow Background Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[200px] bg-[#FF531A]/5 blur-[120px] -z-10 rounded-full" />
      
      <div className="container max-w-7xl mx-auto px-4">
        {/* Newsletter Row */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl mb-16 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Join the FitHub Community</h3>
            <p className="text-zinc-400">Subscribe for early access to drops, exclusive deals, and elite training tips.</p>
          </div>
          <div className="flex w-full md:w-auto gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#FF531A] transition-colors w-full md:w-80"
            />
            <button className="bg-[#FF531A] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#FF531A]/90 transition-colors cursor-pointer flex items-center gap-2 flex-shrink-0">
              Subscribe <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Col 1 - Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-white cursor-pointer w-fit">
              <div className="w-8 h-8 bg-[#FF531A] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                F
              </div>
              <span className="tracking-tight">FitHub</span>
            </Link>
            <p className="text-zinc-400 font-medium leading-relaxed">
              Train harder. Live stronger.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-[#FF531A] hover:border-[#FF531A] hover:text-white transition-all duration-300 cursor-pointer">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-[#FF531A] hover:border-[#FF531A] hover:text-white transition-all duration-300 cursor-pointer">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-[#FF531A] hover:border-[#FF531A] hover:text-white transition-all duration-300 cursor-pointer">
                <Facebook className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Col 2 - Shop */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg tracking-wide uppercase">Shop</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link href="/products" className="hover:text-[#FF531A] transition-colors cursor-pointer block">All Products</Link>
              </li>
              <li>
                <Link href="/products?category=equipment" className="hover:text-[#FF531A] transition-colors cursor-pointer block">Equipment</Link>
              </li>
              <li>
                <Link href="/products?category=supplements" className="hover:text-[#FF531A] transition-colors cursor-pointer block">Supplements</Link>
              </li>
              <li>
                <Link href="/products?category=clothes" className="hover:text-[#FF531A] transition-colors cursor-pointer block">Clothes</Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#FF531A] transition-colors cursor-pointer block">Shopping Cart</Link>
              </li>
            </ul>
          </div>

          {/* Col 3 - Services */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg tracking-wide uppercase">Services</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link href="/services" className="hover:text-[#FF531A] transition-colors cursor-pointer block">All Services</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#FF531A] transition-colors cursor-pointer block">Bookings</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#FF531A] transition-colors cursor-pointer block">Schedule</Link>
              </li>
            </ul>
          </div>

          {/* Col 4 - Account */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg tracking-wide uppercase">Account</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link href="/profile" className="hover:text-[#FF531A] transition-colors cursor-pointer block">My Profile</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#FF531A] transition-colors cursor-pointer block">Dashboard</Link>
              </li>
              <li>
                <Link href="/auth?mode=login" className="hover:text-[#FF531A] transition-colors cursor-pointer block">Login / Register</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="font-medium text-zinc-500">
            &copy; {new Date().getFullYear()} FitHub. All rights reserved.
          </p>
          <div className="flex gap-6 font-medium text-zinc-500">
            <span>Built with ❤️ for athletes</span>
            <Link href="#" className="hover:text-[#FF531A] transition-colors cursor-pointer">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#FF531A] transition-colors cursor-pointer">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

