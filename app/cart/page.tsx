//app\cart\page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Trash2, AlertTriangle, Minus, Plus, ShoppingCart } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalItems, totalPrice } =
    useCart();
  const { toast } = useToast();
  const [validating, setValidating] = useState(true);
  const [removedNames, setRemovedNames] = useState<string[]>([]);

  useEffect(() => {
    if (items.length === 0) {
      setValidating(false);
      return;
    }

    const validate = async () => {
      try {
        const ids = items.map((i) => i.id);
        const res = await fetch("/api/cart/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        });

        if (!res.ok) return;

        const { validIds } = await res.json();
        const removed = items.filter((i) => !validIds.includes(i.id));

        if (removed.length > 0) {
          removed.forEach((i) => removeItem(i.id));
          setRemovedNames(removed.map((i) => i.name));
          toast({
            title: "Cart updated",
            description: `${removed.length} item${removed.length > 1 ? "s" : ""} no longer available and ${removed.length > 1 ? "were" : "was"} removed from your cart.`,
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Cart validation failed:", err);
      } finally {
        setValidating(false);
      }
    };

    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Loading skeleton ── */
  if (validating) {
    return (
      <>
        <Header />
        <main className="min-h-screen relative pb-24">
          <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-primary/5 via-background to-background -z-10" />
          <div className="container max-w-7xl mx-auto px-4 py-16">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-10 tracking-tight">
              Shopping <span className="text-primary">Cart</span>
            </h1>
            <div className="space-y-4">
              {[...Array(items.length || 2)].map((_, i) => (
                <div
                  key={i}
                  className="h-36 rounded-2xl bg-card/50 backdrop-blur border border-border/50 shadow-sm animate-pulse"
                />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  /* ── Empty cart state ── */
  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen relative flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background -z-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] opacity-60 pointer-events-none -z-10" />

          <div className="container max-w-2xl mx-auto px-4 py-16 text-center">
            <Card className="athletic-card p-12 border-border/50 shadow-2xl">
              {/* Empty cart SVG illustration */}
              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 text-muted-foreground/30">
                  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <circle cx="60" cy="60" r="58" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                    <path d="M28 35h8l8 35h36l6-24H44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="52" cy="82" r="5" fill="currentColor" opacity="0.6"/>
                    <circle cx="76" cy="82" r="5" fill="currentColor" opacity="0.6"/>
                    <path d="M55 52h14M62 45v14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
                  </svg>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
                Your Cart is <span className="text-primary">Empty</span>
              </h1>

              {/* Show message if items were auto-removed */}
              {removedNames.length > 0 && (
                <div className="flex items-center justify-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-5 py-4 mb-6">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">
                    <span className="font-bold">{removedNames.join(", ")}</span>{" "}
                    {removedNames.length > 1 ? "are" : "is"} no longer available
                    and {removedNames.length > 1 ? "were" : "was"} removed from
                    your cart.
                  </p>
                </div>
              )}

              <p className="text-base text-muted-foreground mb-8 max-w-md mx-auto">
                Looks like you haven't added anything yet. Discover our premium gear and start your journey.
              </p>
              <Link href="/products">
                <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-lg shadow-primary/25 hover:scale-105 transition-all cursor-pointer">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Start Shopping
                </Button>
              </Link>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  /* ── Cart with items ── */
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background relative pb-24">
        <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-primary/5 via-background to-background -z-10" />

        <div className="container max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-10 tracking-tight">
            Shopping <span className="text-primary">Cart</span>
          </h1>

          {/* Banner if some items were removed */}
          {removedNames.length > 0 && (
            <div className="flex items-start gap-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-5 py-4 mb-8 shadow-sm">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">
                <span className="font-bold block mb-1">Some items were removed from your cart:</span>
                {removedNames.join(", ")}{" "}
                {removedNames.length > 1 ? "are" : "is"} no longer available.
              </p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-10">
            {/* ── Cart items column ── */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="athletic-card border-border/50 overflow-hidden hover:border-primary/30 transition-colors">
                  <CardContent className="p-5 flex gap-5 items-start">
                    {/* Product thumbnail */}
                    <Link href={`/products/${item.id}`} className="flex-shrink-0">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-sm border border-border/40">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.id}`}>
                        <h3 className="font-bold text-base leading-tight hover:text-primary transition-colors cursor-pointer line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-primary font-semibold mt-1">
                        ${item.price.toFixed(2)}{" "}
                        <span className="text-muted-foreground font-normal text-xs">/ unit</span>
                      </p>

                      {/* Quantity stepper */}
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-3 py-1.5 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer select-none font-bold"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-4 py-1.5 text-sm font-bold min-w-[2.5rem] text-center border-x border-zinc-300 dark:border-zinc-700 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1.5 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer select-none font-bold"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Item subtotal */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-muted-foreground mb-0.5">Subtotal</p>
                      <p className="text-lg font-extrabold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ── Order Summary column ── */}
            <div>
              <Card className="athletic-card sticky top-24 border-border/50 shadow-lg">
                <CardContent className="p-7">
                  <h2 className="text-2xl font-extrabold mb-6 tracking-tight">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal <span className="text-foreground/60">({totalItems} {totalItems === 1 ? "item" : "items"})</span></span>
                      <span className="text-foreground font-medium">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-foreground font-medium text-xs italic">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="border-t border-border/60 pt-4 mb-7">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-3xl font-extrabold text-primary">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link href="/checkout" className="block w-full">
                    <Button className="w-full h-13 text-base font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all cursor-pointer py-3">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <Link href="/products" className="block w-full mt-3">
                    <Button
                      variant="outline"
                      className="w-full rounded-xl cursor-pointer text-muted-foreground hover:text-[#FF531A] hover:border-[#FF531A] dark:hover:text-[#FF531A] dark:hover:border-[#FF531A] hover:bg-transparent transition-colors"
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
