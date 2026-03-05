"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
  ChevronRight,
  Edit,
  Package,
  Calendar,
  QrCode,
  Loader2,
  X,
  Check,
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

const STATUS_STYLES: Record<string, string> = {
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

  const [editMode, setEditMode]     = useState(false);
  const [saving, setSaving]         = useState(false);
  const [bookings, setBookings]     = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const [tempName, setTempName]   = useState("");
  const [tempPhone, setTempPhone] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  // Fetch user's bookings
  useEffect(() => {
    if (!user) return;
    fetch("/api/bookings", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoadingBookings(false));
  }, [user]);

  const handleEditStart = () => {
    setTempName(user?.name || "");
    setTempPhone("");
    setEditMode(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: tempName }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      await refreshUser();
      setEditMode(false);
      toast({ title: "Profile updated successfully." });
    } catch {
      toast({ title: "Error", description: "Could not update profile.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // Loading state
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

  const upcomingBookings = bookings.filter((b) =>
    b.status === "pending" || b.status === "confirmed"
  );
  const pastBookings = bookings.filter((b) =>
    b.status === "completed" || b.status === "cancelled" || b.status === "no-show"
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Profile</span>
            </div>
          </div>
        </div>

        <section className="py-12">
          <div className="container max-w-6xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-8">My Account</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ── Profile Card ── */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {editMode ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            value={user.email}
                            disabled
                            className="opacity-50 cursor-not-allowed"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Email cannot be changed.
                          </p>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1"
                          >
                            {saving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <><Check className="w-4 h-4 mr-1" /> Save</>
                            )}
                          </Button>
                          <Button
                            onClick={() => setEditMode(false)}
                            variant="outline"
                            className="flex-1"
                            disabled={saving}
                          >
                            <X className="w-4 h-4 mr-1" /> Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Avatar */}
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
                            user.role === "admin"
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary text-muted-foreground"
                          }`}>
                            {user.role === "admin" ? "Administrator" : "Member"}
                          </span>
                        </div>

                        <Button
                          onClick={handleEditStart}
                          variant="outline"
                          className="w-full"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>

                        {user.role === "admin" && (
                          <Link href="/admin">
                            <Button className="w-full" variant="secondary">
                              Go to Admin Dashboard
                            </Button>
                          </Link>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Booking summary card */}
                <Card className="mt-4">
                  <CardContent className="p-4 grid grid-cols-2 gap-4 text-center">
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

              {/* ── Tabs: Orders + Bookings ── */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="bookings" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="orders">
                      <Package className="w-4 h-4 mr-2" />
                      Orders
                    </TabsTrigger>
                    <TabsTrigger value="bookings">
                      <Calendar className="w-4 h-4 mr-2" />
                      Bookings
                      {upcomingBookings.length > 0 && (
                        <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                          {upcomingBookings.length}
                        </span>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  {/* Orders Tab — empty until checkout is built */}
                  <TabsContent value="orders" className="mt-4">
                    <div className="text-center py-16 border border-dashed border-border rounded-xl">
                      <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="font-semibold mb-1">No orders yet</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your product orders will appear here.
                      </p>
                      <Link href="/products">
                        <Button variant="outline">Browse Products</Button>
                      </Link>
                    </div>
                  </TabsContent>

                  {/* Bookings Tab — real data */}
                  <TabsContent value="bookings" className="mt-4 space-y-4">
                    {loadingBookings ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="text-center py-16 border border-dashed border-border rounded-xl">
                        <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <p className="font-semibold mb-1">No bookings yet</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Book a service and it will appear here.
                        </p>
                        <Link href="/services">
                          <Button variant="outline">Browse Services</Button>
                        </Link>
                      </div>
                    ) : (
                      <>
                        {/* Upcoming bookings */}
                        {upcomingBookings.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                              Upcoming
                            </p>
                            <div className="space-y-3">
                              {upcomingBookings.map((b) => (
                                <BookingCard key={b._id} booking={b} />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Past bookings */}
                        {pastBookings.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 mt-6">
                              Past
                            </p>
                            <div className="space-y-3">
                              {pastBookings.map((b) => (
                                <BookingCard key={b._id} booking={b} />
                              ))}
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
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <p className="font-semibold">{booking.serviceName}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[booking.status] || ""}`}>
                {booking.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(booking.date).toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}{" "}
              at {booking.time}
            </p>
            {booking.notes && (
              <p className="text-xs text-muted-foreground italic mt-1">
                Note: {booking.notes}
              </p>
            )}
          </div>

          {/* Check-in code — shown for upcoming bookings */}
          {(booking.status === "pending" || booking.status === "confirmed") && (
            <div className="flex flex-col items-center bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 flex-shrink-0">
              <QrCode className="w-4 h-4 text-primary mb-1" />
              <p className="text-xs text-muted-foreground">Check-in</p>
              <p className="text-sm font-bold tracking-wider text-primary">
                {booking.checkInCode}
              </p>
            </div>
          )}
        </div>

        {/* Rebook button for cancelled/completed */}
        {(booking.status === "completed" || booking.status === "cancelled") && (
          <div className="mt-3 pt-3 border-t border-border">
            <Link href="/services">
              <Button variant="outline" size="sm">Book Again</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}