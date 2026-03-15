"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronRight, Edit, Package, Calendar, QrCode,
  Loader2, X, Check, ShoppingBag,
} from "lucide-react";

interface Booking {
  _id: string;
  serviceName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no-show";
  checkInCode: string;
  notes?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{ name: string; image: string; price: number; quantity: number }>;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: { fullName: string; address: string; city: string; zip: string; country: string };
  createdAt: string;
}

const ORDER_STATUS_STYLES: Record<string, string> = {
  pending:    "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  shipped:    "bg-purple-500/10 text-purple-500 border-purple-500/20",
  delivered:  "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled:  "bg-red-500/10 text-red-500 border-red-500/20",
};

const BOOKING_STATUS_STYLES: Record<string, string> = {
  pending:   "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  "no-show": "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [tempName, setTempName] = useState("");

  const [bookings, setBookings]               = useState<Booking[]>([]);
  const [orders, setOrders]                   = useState<Order[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingOrders, setLoadingOrders]     = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    fetch("/api/bookings", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setBookings(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoadingBookings(false));

    fetch("/api/orders", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoadingOrders(false));
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: tempName }),
      });
      if (!res.ok) throw new Error();
      await refreshUser();
      setEditMode(false);
      toast({ title: "Profile updated." });
    } catch {
      toast({ title: "Error", description: "Could not update profile.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </>
    );
  }
  if (!user) return null;

  const upcomingBookings = bookings.filter((b) => ["pending", "confirmed"].includes(b.status));
  const pastBookings     = bookings.filter((b) => ["completed", "cancelled", "no-show"].includes(b.status));
  const activeOrders     = orders.filter((o) => ["pending", "processing", "shipped"].includes(o.status));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background relative pb-24">
        <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-primary/5 via-background to-background -z-10" />
        <div className="border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-40">
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Home</Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">Profile</span>
            </div>
          </div>
        </div>

        <section className="py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-10 tracking-tight">My <span className="text-primary">Account</span></h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* ── Profile Card ── */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="athletic-card border-border/50">
                  <CardHeader className="bg-secondary/30 border-b border-border/50 pb-5"><CardTitle className="text-2xl font-extrabold tracking-tight">Profile Information</CardTitle></CardHeader>
                  <CardContent className="p-6 text-base space-y-6">
                    {editMode ? (
                      <div className="space-y-4">
                        <div>
                          <Label>Full Name</Label>
                          <Input value={tempName} onChange={(e) => setTempName(e.target.value)} />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input value={user.email} disabled className="opacity-50 cursor-not-allowed" />
                          <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSave} disabled={saving} className="flex-1">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1" />Save</>}
                          </Button>
                          <Button onClick={() => setEditMode(false)} variant="outline" className="flex-1" disabled={saving}>
                            <X className="w-4 h-4 mr-1" />Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-center">
                          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Full Name</p>
                          <p className="font-semibold">{user.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Email</p>
                          <p className="font-semibold">{user.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Role</p>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                            user.role === "admin" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                          }`}>
                            {user.role === "admin" ? "Administrator" : "Member"}
                          </span>
                        </div>
                        <Button onClick={() => { setTempName(user.name); setEditMode(true); }} variant="outline" className="w-full">
                          <Edit className="w-4 h-4 mr-2" />Edit Profile
                        </Button>
                        {user.role === "admin" && (
                          <Link href="/admin">
                            <Button className="w-full" variant="secondary">Go to Admin Dashboard</Button>
                          </Link>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Stats */}
                <Card className="athletic-card border-border/50">
                  <CardContent className="p-6 grid grid-cols-3 gap-4 text-center divide-x divide-border/50">
                    <div>
                      <p className="text-3xl font-extrabold text-foreground">{orders.length}</p>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Orders</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{upcomingBookings.length}</p>
                      <p className="text-xs text-muted-foreground">Upcoming</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{pastBookings.length}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* ── Tabs ── */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="orders" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="orders">
                      <Package className="w-4 h-4 mr-2" />Orders
                      {activeOrders.length > 0 && (
                        <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                          {activeOrders.length}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="bookings">
                      <Calendar className="w-4 h-4 mr-2" />Bookings
                      {upcomingBookings.length > 0 && (
                        <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                          {upcomingBookings.length}
                        </span>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  {/* Orders */}
                  <TabsContent value="orders" className="mt-4 space-y-4">
                    {loadingOrders ? (
                      <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-16 border border-dashed border-border rounded-xl">
                        <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <p className="font-semibold mb-1">No orders yet</p>
                        <p className="text-sm text-muted-foreground mb-4">Your product orders will appear here.</p>
                        <Link href="/products"><Button variant="outline">Browse Products</Button></Link>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <Card key={order._id} className="athletic-card border-border/50 mb-4 overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                              <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Order Number</p>
                                <p className="font-bold text-lg text-primary">{order.orderNumber}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${ORDER_STATUS_STYLES[order.status] || ""}`}>
                                  {order.status}
                                </span>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2 mb-4">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                  <div className="relative w-10 h-10 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                                    {item.image
                                      ? <Image src={item.image} alt={item.name} fill className="object-cover" />
                                      : <ShoppingBag className="w-4 h-4 text-muted-foreground m-auto mt-3" />}
                                  </div>
                                  <p className="text-sm flex-1">{item.name} <span className="text-muted-foreground">×{item.quantity}</span></p>
                                  <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                              ))}
                            </div>
                            <div className="border-t border-border pt-3 flex justify-between items-center">
                              <p className="text-xs text-muted-foreground">
                                Ships to {order.shippingAddress.city}, {order.shippingAddress.country}
                              </p>
                              <p className="font-bold text-primary">${order.total.toFixed(2)}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>

                  {/* Bookings */}
                  <TabsContent value="bookings" className="mt-4 space-y-4">
                    {loadingBookings ? (
                      <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                    ) : bookings.length === 0 ? (
                      <div className="text-center py-16 border border-dashed border-border rounded-xl">
                        <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <p className="font-semibold mb-1">No bookings yet</p>
                        <p className="text-sm text-muted-foreground mb-4">Book a service and it will appear here.</p>
                        <Link href="/services"><Button variant="outline">Browse Services</Button></Link>
                      </div>
                    ) : (
                      <>
                        {upcomingBookings.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Upcoming</p>
                            <div className="space-y-3">
                              {upcomingBookings.map((b) => <BookingCard key={b._id} booking={b} />)}
                            </div>
                          </div>
                        )}
                        {pastBookings.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 mt-6">Past</p>
                            <div className="space-y-3">
                              {pastBookings.map((b) => <BookingCard key={b._id} booking={b} />)}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const STYLES: Record<string, string> = {
    pending:   "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    "no-show": "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };
  return (
    <Card className="athletic-card border-border/50 mb-4 overflow-hidden hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <p className="font-semibold">{booking.serviceName}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STYLES[booking.status] || ""}`}>
                {booking.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(booking.date).toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })} at {booking.time}
            </p>
            {booking.notes && <p className="text-xs text-muted-foreground italic mt-1">Note: {booking.notes}</p>}
          </div>
          {["pending", "confirmed"].includes(booking.status) && (
            <div className="flex flex-col items-center bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 flex-shrink-0">
              <QrCode className="w-4 h-4 text-primary mb-1" />
              <p className="text-xs text-muted-foreground">Check-in</p>
              <p className="text-sm font-bold tracking-wider text-primary">{booking.checkInCode}</p>
            </div>
          )}
        </div>
        {["completed", "cancelled"].includes(booking.status) && (
          <div className="mt-3 pt-3 border-t border-border">
            <Link href="/services"><Button variant="outline" size="sm">Book Again</Button></Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}