"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  CheckCircle,
  ChevronRight,
  CreditCard,
  Lock,
  Loader2,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";

// ── Mock processing steps shown during "payment" ──────────────
const PROCESSING_STEPS = [
  "Verifying payment details...",
  "Contacting payment processor...",
  "Confirming your order...",
  "Almost done...",
];

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState<"form" | "processing" | "confirmed">("form");
  const [processingStep, setProcessingStep] = useState(0);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardName: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth?callbackUrl=/checkout");
    }
  }, [user, authLoading, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!authLoading && items.length === 0 && step === "form") {
      router.push("/cart");
    }
  }, [items, authLoading, step, router]);

  // Pre-fill name from user
  useEffect(() => {
    if (user?.name) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    // Auto-format card number: groups of 4
    if (name === "cardNumber") {
      value = value.replace(/\D/g, "").substring(0, 16);
      value = value.replace(/(.{4})/g, "$1 ").trim();
    }
    // Auto-format expiry: MM/YY
    if (name === "expiry") {
      value = value.replace(/\D/g, "").substring(0, 4);
      if (value.length >= 3) value = value.slice(0, 2) + "/" + value.slice(2);
    }
    // CVC: digits only
    if (name === "cvc") {
      value = value.replace(/\D/g, "").substring(0, 3);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const runProcessingAnimation = () =>
    new Promise<void>((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        setProcessingStep(i);
        i++;
        if (i >= PROCESSING_STEPS.length) {
          clearInterval(interval);
          setTimeout(resolve, 600);
        }
      }, 700);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");

    const orderData = {
      items: items.map((item) => ({
        productId: item.id,
        name: item.name,
        image: item.image || "",
        price: item.price,
        quantity: item.quantity,
      })),
      total: totalPrice,
      shippingAddress: {
        fullName: formData.fullName,
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
        country: formData.country,
      },
      paymentMethod: "card",
    };

    try {
      // Run animation in parallel with the real API call
      const [, res] = await Promise.all([
        runProcessingAnimation(),
        fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(orderData),
        }),
      ]);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Order failed");
      }

      const order = await res.json();
      clearCart();
      setConfirmedOrder(order);
      setStep("confirmed");
    } catch (error: any) {
      setStep("form");
      toast({
        title: "Order failed",
        description: error.message || "Could not place order. Try again.",
        variant: "destructive",
      });
    }
  };

  const shipping = totalPrice >= 100 ? 0 : 9.99;
  const grandTotal = totalPrice + shipping;

  // ── Processing screen ─────────────────────────────────────────
  if (step === "processing") {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background relative flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background -z-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] opacity-70 animate-pulse pointer-events-none -z-10" />
          
          <div className="text-center w-full max-w-sm mx-auto">
            <Card className="athletic-card p-12 border-border/50 text-center shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 relative">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <h2 className="text-3xl font-extrabold mb-3 tracking-tight text-balance">Processing Order</h2>
              <p className="text-muted-foreground mb-10 text-lg font-medium">
                Please do not close this page.
              </p>
              <div className="space-y-4 text-left">
                {PROCESSING_STEPS.map((s, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-4 text-base transition-all duration-300 ${
                      i < processingStep
                        ? "text-primary"
                        : i === processingStep
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground/40"
                    }`}
                  >
                    {i < processingStep ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : i === processingStep ? (
                      <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin text-primary" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/20 flex-shrink-0" />
                    )}
                    {s}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Confirmation screen ──────────────────────────────────────
  if (step === "confirmed" && confirmedOrder) {
    return (
      <>
        <Header />
        <main className="min-h-screen relative pb-24">
          <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-primary/10 via-background to-background -z-10" />
          
          <div className="container max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full translate-y-2 scale-90" />
                <CheckCircle className="w-24 h-24 text-primary relative z-10 animate-in zoom-in duration-500" />
              </div>
            </div>
            <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-balance">Order <span className="text-primary">Confirmed!</span></h1>
            <p className="text-xl text-muted-foreground mb-10 font-medium max-w-md mx-auto">
              Your premium athletic gear is being prepared. We'll send you a tracking link shortly.
            </p>

            <Card className="athletic-card mb-10 text-left border-primary/20 shadow-xl shadow-primary/5">
              <CardContent className="p-8 space-y-8">
                {/* Order number */}
                <div className="flex flex-col items-center bg-card/60 border border-primary/20 rounded-2xl p-6 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
                  <Package className="w-8 h-8 text-primary mb-3 relative z-10" />
                  <p className="text-sm text-muted-foreground uppercase tracking-[0.2em] font-bold mb-1 relative z-10">
                    Order Number
                  </p>
                  <p className="text-3xl font-extrabold tracking-widest text-primary relative z-10">
                    {confirmedOrder.orderNumber}
                  </p>
                </div>

                {/* Items */}
                <div>
                  <p className="text-sm text-foreground font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-primary" /> Items Ordered
                  </p>
                  <div className="space-y-4">
                    {confirmedOrder.items.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 bg-secondary/30 p-3 rounded-xl border border-border/50">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-background border border-border flex-shrink-0 shadow-sm">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <ShoppingBag className="w-6 h-6 text-muted-foreground m-auto mt-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground font-medium">
                            Qty: <span className="text-foreground">{item.quantity}</span>
                          </p>
                        </div>
                        <p className="text-lg font-bold text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-secondary/30 p-5 rounded-xl border border-border/50 space-y-3">
                  <div className="flex justify-between text-base text-muted-foreground font-medium">
                    <span>Subtotal</span>
                    <span className="text-foreground">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base text-muted-foreground font-medium pb-3 border-b border-border/50">
                    <span>Shipping</span>
                    <span className="text-foreground">
                      {shipping === 0 ? <span className="text-green-500">Free</span> : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-extrabold text-2xl pt-2">
                    <span>Total</span>
                    <span className="text-primary">
                      ${confirmedOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Shipping address */}
                <div className="border border-border/50 rounded-xl p-5 bg-card/40">
                  <p className="text-sm text-foreground font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary" /> Ships To
                  </p>
                  <div className="flex items-start gap-3">
                    <p className="text-base font-medium leading-relaxed">
                      <span className="block font-bold text-lg mb-1">{confirmedOrder.shippingAddress.fullName}</span>
                      {confirmedOrder.shippingAddress.address}<br/>
                      {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.zip}<br/>
                      {confirmedOrder.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full h-14 rounded-full text-lg border-2">Continue Shopping</Button>
              </Link>
              <Link href="/profile" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-14 rounded-full text-lg shadow-lg">View My Orders</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Checkout form ─────────────────────────────────────────────
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background relative pb-24">
        <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-primary/5 via-background to-background -z-10" />

        {/* Breadcrumb */}
        <div className="border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-40">
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Link
                href="/cart"
                className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Cart
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">Checkout</span>
            </div>
          </div>
        </div>

        <div className="container max-w-6xl mx-auto px-4 py-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-10 tracking-tight">Secure <span className="text-primary">Checkout</span></h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Left: Shipping + Payment */}
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping */}
                <Card className="athletic-card border-border/50 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <CardHeader className="pl-8 pb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Truck className="w-6 h-6 text-primary" />
                      </div>
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5 px-8 pb-8">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="font-bold text-muted-foreground uppercase text-xs tracking-wider">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="h-12 bg-secondary/50 border-border"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="font-bold text-muted-foreground uppercase text-xs tracking-wider">Street Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Main Street"
                        className="h-12 bg-secondary/50 border-border"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="font-bold text-muted-foreground uppercase text-xs tracking-wider">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="New York"
                          className="h-12 bg-secondary/50 border-border"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip" className="font-bold text-muted-foreground uppercase text-xs tracking-wider">ZIP / Postal Code</Label>
                        <Input
                          id="zip"
                          name="zip"
                          value={formData.zip}
                          onChange={handleChange}
                          placeholder="10001"
                          className="h-12 bg-secondary/50 border-border"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="font-bold text-muted-foreground uppercase text-xs tracking-wider">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="United States"
                        className="h-12 bg-secondary/50 border-border"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment */}
                <Card className="athletic-card border-border/50 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                  <CardHeader className="pl-8 pb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <CreditCard className="w-6 h-6 text-blue-500" />
                      </div>
                      Payment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5 px-8 pb-8">
                    {/* Mock notice */}
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3 text-yellow-600 dark:text-yellow-400">
                      <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-medium leading-relaxed">
                        This is a secure demo checkout. Real payment processing is bypassed and no card will be charged.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName" className="font-bold text-muted-foreground uppercase text-xs tracking-wider">Name on Card</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        placeholder="JOHN DOE"
                        className="h-12 bg-secondary/50 border-border font-mono uppercase"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber" className="font-bold text-muted-foreground uppercase text-xs tracking-wider">Card Number</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          className="h-12 bg-secondary/50 border-border font-mono text-lg tracking-widest pl-12"
                          required
                        />
                        <CreditCard className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="expiry" className="font-bold text-muted-foreground uppercase text-xs tracking-wider">Expiry Date</Label>
                        <Input
                          id="expiry"
                          name="expiry"
                          value={formData.expiry}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="h-12 bg-secondary/50 border-border font-mono text-center text-lg tracking-widest"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc" className="font-bold text-muted-foreground uppercase text-xs tracking-wider">Security Code (CVC)</Label>
                        <Input
                          id="cvc"
                          name="cvc"
                          value={formData.cvc}
                          onChange={handleChange}
                          placeholder="123"
                          maxLength={3}
                          className="h-12 bg-secondary/50 border-border font-mono text-center text-lg tracking-widest"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right: Order Summary */}
              <div className="lg:w-[400px]">
                <Card className="athletic-card sticky top-24 border-border/50">
                  <CardHeader className="bg-secondary/30 border-b border-border/50 pb-5">
                    <CardTitle className="text-2xl font-extrabold tracking-tight">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Items */}
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-background border border-border flex-shrink-0 shadow-sm">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">
                              {item.name}
                            </p>
                            <p className="text-sm text-muted-foreground font-medium mt-1">
                              Qty: <span className="text-foreground">{item.quantity}</span>
                            </p>
                          </div>
                          <p className="text-lg font-bold text-primary flex-shrink-0">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="bg-secondary/30 p-5 rounded-xl border border-border/50 space-y-3">
                      <div className="flex justify-between text-sm text-muted-foreground font-medium">
                        <span>Subtotal</span>
                        <span className="text-foreground">${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground font-medium">
                        <span>Shipping</span>
                        <span>
                          {shipping === 0 ? (
                            <span className="text-green-500 font-bold">
                              Free
                            </span>
                          ) : (
                            <span className="text-foreground">${shipping.toFixed(2)}</span>
                          )}
                        </span>
                      </div>
                      {shipping > 0 && (
                        <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min((totalPrice / 100) * 100, 100)}%` }} />
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-2 text-center">
                            ${(100 - totalPrice).toFixed(2)} away from free shipping
                          </p>
                        </div>
                      )}
                      
                      <div className="flex justify-between font-extrabold text-2xl pt-4 border-t border-border/50 mt-2">
                        <span>Total</span>
                        <span className="text-primary">
                          ${grandTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full h-16 text-lg rounded-xl shadow-lg hover:scale-[1.03] transition-all relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                      <Lock className="w-5 h-5 mr-3" />
                      Pay ${grandTotal.toFixed(2)} Now
                    </Button>

                    <p className="text-xs text-center text-muted-foreground font-medium">
                      By proceeding, you agree to our <Link href="#" className="underline hover:text-primary transition-colors">Terms of Service</Link> and <Link href="#" className="underline hover:text-primary transition-colors">Privacy Policy</Link>.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
