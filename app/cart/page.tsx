"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Trash2, AlertTriangle } from "lucide-react";
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
        // Send all cart item IDs to the API to check which still exist
        const ids = items.map((i) => i.id);
        const res = await fetch("/api/cart/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        });

        if (!res.ok) return;

        const { validIds } = await res.json();

        // Find items that no longer exist in DB
        const removed = items.filter((i) => !validIds.includes(i.id));

        if (removed.length > 0) {
          // Remove them from cart
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
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (validating) {
    return (
      <>
        <Header />
        <main className="min-h-screen relative pb-24">
          <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-primary/5 via-background to-background -z-10" />
          <div className="container max-w-7xl mx-auto px-4 py-16">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-10 tracking-tight">Shopping <span className="text-primary">Cart</span></h1>
            <div className="space-y-6">
              {[...Array(items.length || 2)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 rounded-2xl bg-card/50 backdrop-blur border border-border/50 shadow-sm animate-pulse"
                />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen relative flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background -z-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] opacity-60 pointer-events-none -z-10" />
          
          <div className="container max-w-2xl mx-auto px-4 py-16 text-center">
            <Card className="athletic-card p-12 border-border/50 shadow-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Your Cart is <span className="text-primary">Empty</span></h1>
              {/* Show message if items were auto-removed */}
              {removedNames.length > 0 && (
                <div className="flex items-center justify-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-5 py-4 mb-8">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">
                    <span className="font-bold">
                      {removedNames.join(", ")}
                    </span>{" "}
                    {removedNames.length > 1 ? "are" : "is"} no longer available
                    and {removedNames.length > 1 ? "were" : "was"} removed from
                    your cart.
                  </p>
                </div>
              )}
              <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. Discover our premium gear and start your journey.
              </p>
              <Link href="/products">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:scale-105 transition-all">
                  Shop Premium Gear
                </Button>
              </Link>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background relative pb-24">
        <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-primary/5 via-background to-background -z-10" />
        
        <div className="container max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-10 tracking-tight">Shopping <span className="text-primary">Cart</span></h1>

          {/* Banner if some items were removed */}
          {removedNames.length > 0 && (
            <div className="flex items-start gap-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-5 py-4 mb-8 shadow-sm">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">
                <span className="font-bold block mb-1">
                  Some items were removed from your cart:
                </span>{" "}
                {removedNames.join(", ")}{" "}
                {removedNames.length > 1 ? "are" : "is"} no longer available.
              </p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <Card key={item.id} className="athletic-card border-border/50 p-1">
                  <CardContent className="p-5 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-secondary shadow-inner">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left w-full">
                      <h3 className="text-xl font-bold tracking-tight mb-1">{item.name}</h3>
                      <p className="text-sm text-primary font-medium mb-4">
                        ${item.price.toFixed(2)} <span className="text-muted-foreground font-normal">each</span>
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-4">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.id,
                              parseInt(e.target.value) || 1,
                            )
                          }
                          className="w-24 text-center font-bold"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-primary sm:text-right mt-4 sm:mt-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="athletic-card sticky top-24 border-border/50">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-extrabold mb-6 tracking-tight border-b border-border/50 pb-4">Order Summary</h2>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-muted-foreground font-medium">
                      <span>Subtotal ({totalItems} items)</span>
                      <span className="text-foreground">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground font-medium">
                      <span>Shipping</span>
                      <span className="text-foreground">Calculated at checkout</span>
                    </div>
                    <div className="border-t border-border/50 pt-4 flex justify-between items-center">
                      <span className="text-xl font-bold">Total</span>
                      <span className="text-3xl font-extrabold text-primary">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <Link href="/checkout" className="block w-full">
                    <Button className="w-full h-14 text-lg rounded-xl shadow-lg hover:scale-105 transition-all">Proceed to Checkout</Button>
                  </Link>
                  <Link href="/products" className="block w-full text-center mt-4">
                    <Button variant="ghost" className="text-muted-foreground hover:text-primary">
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
