//app/not-found.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, ShoppingBag, Dumbbell } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background relative flex items-center justify-center p-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-background -z-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-[10%] right-[10%] w-[20%] h-[20%] rounded-full bg-blue-500/5 blur-[80px] pointer-events-none -z-10" />

        <div className="container max-w-2xl mx-auto text-center">

          {/* 404 illustration */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Glow behind the number */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
              <div className="relative flex items-center gap-2">
                <span className="text-[8rem] md:text-[12rem] font-extrabold leading-none tracking-tighter text-primary/10 select-none">
                  4
                </span>
                {/* Dumbbell icon as the zero */}
                <div className="flex items-center justify-center w-24 h-24 md:w-36 md:h-36 relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                  <Dumbbell className="w-12 h-12 md:w-20 md:h-20 text-primary relative z-10" />
                </div>
                <span className="text-[8rem] md:text-[12rem] font-extrabold leading-none tracking-tighter text-primary/10 select-none">
                  4
                </span>
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Page Not <span className="text-primary">Found</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-3 max-w-md mx-auto font-medium">
            Looks like this page skipped leg day — it simply doesn't exist.
          </p>
          <p className="text-sm text-muted-foreground mb-10 max-w-sm mx-auto">
            The page you're looking for may have been moved, deleted, or never existed in the first place.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="lg"
              className="h-13 px-8 rounded-full border-2 cursor-pointer font-bold"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
            <Link href="/">
              <Button
                size="lg"
                className="h-13 px-8 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all cursor-pointer font-bold w-full"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Quick links */}
          <div className="border-t border-border/50 pt-8">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">
              Or explore these pages
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/products">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full border border-border/50 hover:border-primary hover:text-primary cursor-pointer transition-all gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shop Products
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full border border-border/50 hover:border-primary hover:text-primary cursor-pointer transition-all gap-2"
                >
                  <Dumbbell className="w-4 h-4" />
                  Our Services
                </Button>
              </Link>
              <Link href="/services/booking">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full border border-border/50 hover:border-primary hover:text-primary cursor-pointer transition-all gap-2"
                >
                  Book a Session
                </Button>
              </Link>
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full border border-border/50 hover:border-primary hover:text-primary cursor-pointer transition-all gap-2"
                >
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}