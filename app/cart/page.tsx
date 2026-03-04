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
        <main className="min-h-screen bg-background">
          <div className="container max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
            <div className="space-y-4">
              {[...Array(items.length || 2)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 rounded-lg bg-secondary animate-pulse"
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
        <main className="min-h-screen bg-background">
          <div className="container max-w-7xl mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
            {/* Show message if items were auto-removed */}
            {removedNames.length > 0 && (
              <div className="flex items-center justify-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 mb-6 max-w-md mx-auto">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm">
                  <span className="font-semibold">
                    {removedNames.join(", ")}
                  </span>{" "}
                  {removedNames.length > 1 ? "are" : "is"} no longer available
                  and {removedNames.length > 1 ? "were" : "was"} removed from
                  your cart.
                </p>
              </div>
            )}
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Shopping Cart</h1>

          {/* Banner if some items were removed */}
          {removedNames.length > 0 && (
            <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 mb-6">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                <span className="font-semibold">
                  Some items were removed from your cart:
                </span>{" "}
                {removedNames.join(", ")}{" "}
                {removedNames.length > 1 ? "are" : "is"} no longer available.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4 flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </p>
                      <div className="flex items-center gap-4 mt-2">
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
                          className="w-20"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="border-t pt-2 font-bold flex justify-between">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <Link href="/checkout">
                    <Button className="w-full">Proceed to Checkout</Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="link" className="w-full mt-2">
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
