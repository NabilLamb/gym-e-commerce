// app/admin/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ChevronRight, Plus, Edit, BarChart3 } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  "no-show": "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const CATEGORY_LABELS: Record<string, string> = {
  "personal-training": "Personal Training",
  "group-class":       "Group Class",
  "facility-access":   "Facility Access",
  "assessment":        "Assessment",
  "online-coaching":   "Online Coaching",
};

export default function AdminPage() {
  const { toast } = useToast();
  const [products, setProducts]   = useState<any[]>([]);
  const [services, setServices]   = useState<any[]>([]);
  const [bookings, setBookings]   = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);

  const fetchAll = async () => {
    const [p, s, b] = await Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/services").then((r) => r.json()),
      fetch("/api/bookings", { credentials: "include" }).then((r) => r.ok ? r.json() : []),
    ]);
    setProducts(p);
    setServices(s);
    setBookings(b);
  };

  useEffect(() => {
    fetchAll().finally(() => setLoading(false));
  }, []);

  const handleDeleteProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast({ title: "Product deleted" });
    }
  };

  const handleDeleteService = async (id: string) => {
    const res = await fetch("/api/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setServices((prev) => prev.filter((s) => s._id !== id));
      toast({ title: "Service deleted" });
    }
  };

  const handleBookingStatus = async (id: string, status: string) => {
    const res = await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status } : b));
      toast({ title: "Status updated" });
    }
  };

  const handleDeleteBooking = async (id: string) => {
    const res = await fetch("/api/bookings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setBookings((prev) => prev.filter((b) => b._id !== id));
      toast({ title: "Booking deleted" });
    }
  };

  const activeBookings = bookings.filter((b) =>
    b.status === "pending" || b.status === "confirmed"
  ).length;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Admin Dashboard</span>
            </div>
          </div>
        </div>

        <section className="py-12">
          <div className="container max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard title="Total Revenue"  value="$0.00" />
              <StatCard title="Total Orders"   value="0" />
              <StatCard title="Total Bookings" value={bookings.length.toString()} />
              <StatCard title="Total Products" value={products.length.toString()} />
            </div>

            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="bookings">
                  Bookings
                  {activeBookings > 0 && (
                    <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                      {activeBookings}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* ── Products ── */}
              <TabsContent value="products" className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Manage Products</h2>
                  <Link href="/admin/products/add">
                    <Button><Plus className="w-4 h-4 mr-2" /> Add Product</Button>
                  </Link>
                </div>
                {loading ? <p className="text-muted-foreground">Loading...</p>
                  : products.length === 0 ? <p className="text-muted-foreground">No products yet.</p>
                  : (
                    <div className="space-y-2">
                      {products.map((p) => (
                        <Card key={p._id}>
                          <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <p className="font-semibold">{p.name}</p>
                              <p className="text-sm text-muted-foreground capitalize">
                                {p.category} — ${p.price}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Link href={`/admin/products/edit/${p._id}`}>
                                <Button size="sm" variant="outline"><Edit className="w-4 h-4" /></Button>
                              </Link>
                              <DeleteButton id={p._id} onDelete={handleDeleteProduct} />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
              </TabsContent>

              {/* ── Services ── */}
              <TabsContent value="services" className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Manage Services</h2>
                  <Link href="/admin/services/add">
                    <Button><Plus className="w-4 h-4 mr-2" /> Add Service</Button>
                  </Link>
                </div>
                {loading ? <p className="text-muted-foreground">Loading...</p>
                  : services.length === 0 ? <p className="text-muted-foreground">No services yet.</p>
                  : (
                    <div className="space-y-2">
                      {services.map((s) => (
                        <Card key={s._id}>
                          <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <p className="font-semibold">{s.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {CATEGORY_LABELS[s.category] || s.category} —{" "}
                                ${s.price} · {s.duration} · {s.location}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Link href={`/admin/services/edit/${s._id}`}>
                                <Button size="sm" variant="outline"><Edit className="w-4 h-4" /></Button>
                              </Link>
                              <DeleteButton id={s._id} onDelete={handleDeleteService} />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
              </TabsContent>

              {/* ── Bookings ── */}
              <TabsContent value="bookings" className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Manage Bookings</h2>
                  <p className="text-sm text-muted-foreground">
                    {bookings.length} total · {activeBookings} active
                  </p>
                </div>
                {loading ? <p className="text-muted-foreground">Loading...</p>
                  : bookings.length === 0 ? <p className="text-muted-foreground">No bookings yet.</p>
                  : (
                    <div className="space-y-2">
                      {bookings.map((b) => (
                        <Card key={b._id}>
                          <CardContent className="p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <p className="font-semibold">{b.fullName}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[b.status] || ""}`}>
                                  {b.status}
                                </span>
                                <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded">
                                  {b.checkInCode}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {b.serviceName} —{" "}
                                {new Date(b.date).toLocaleDateString("en-US", {
                                  weekday: "short", month: "short", day: "numeric",
                                })}{" "}
                                at {b.time}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {b.email} · {b.phone}
                              </p>
                              {b.notes && (
                                <p className="text-xs text-muted-foreground italic mt-1">
                                  "{b.notes}"
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Select
                                value={b.status}
                                onValueChange={(v) => handleBookingStatus(b._id, v)}
                              >
                                <SelectTrigger className="w-36 h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                  <SelectItem value="no-show">No-show</SelectItem>
                                </SelectContent>
                              </Select>
                              <DeleteButton id={b._id} onDelete={handleDeleteBooking} />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-primary">{value}</p>
          </div>
          <BarChart3 className="w-10 h-10 text-primary/20" />
        </div>
      </CardContent>
    </Card>
  );
}
