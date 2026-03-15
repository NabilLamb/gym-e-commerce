//app/admin/page.tsx

"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AdminListRow } from "@/components/admin/AdminListRow";
import {
  ChevronRight, Plus, Edit, BarChart3, ShoppingBag, Eye, ToggleLeft, ToggleRight,
  Mail, MailOpen, MailCheck, // ← added for messages
} from "lucide-react";

// ===== INTERFACES =====
interface IMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const BOOKING_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  "no-show": "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  delivered: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const CATEGORY_LABELS: Record<string, string> = {
  "personal-training": "Personal Training",
  "group-class": "Group Class",
  "facility-access": "Facility Access",
  "assessment": "Assessment",
  "online-coaching": "Online Coaching",
};

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-8">Loading dashboard...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "products";

  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]); // ← new state
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    const [p, s, b, o, m] = await Promise.all([
      fetch("/api/products?all=true", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/services?all=true", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/bookings", { credentials: "include" }).then((r) => r.ok ? r.json() : []),
      fetch("/api/orders", { credentials: "include" }).then((r) => r.ok ? r.json() : []),
      fetch("/api/messages", { credentials: "include" }).then((r) => r.ok ? r.json() : []),
    ]);
    setProducts(Array.isArray(p) ? p : []);
    setServices(Array.isArray(s) ? s : []);
    setBookings(Array.isArray(b) ? b : []);
    setOrders(Array.isArray(o) ? o : []);
    setMessages(Array.isArray(m) ? m : []);
  };

  useEffect(() => { fetchAll().finally(() => setLoading(false)); }, []);

  // ── Handlers ──────────────────────────────────────────────────
  const handleDeleteProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) { setProducts((p) => p.filter((x) => x._id !== id)); toast({ title: "Product deleted" }); }
  };

  const handleDeleteService = async (id: string) => {
    const res = await fetch("/api/services", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) { setServices((s) => s.filter((x) => x._id !== id)); toast({ title: "Service deleted" }); }
  };

  const handleToggleProduct = async (p: any) => {
    const res = await fetch(`/api/products/${p._id}/toggle-active`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    if (res.ok) {
      setProducts((prev) =>
        prev.map((x) => x._id === p._id ? { ...x, isActive: !p.isActive } : x)
      );
      toast({
        title: p.isActive ? "Product hidden from users" : "Product is now visible to users",
      });
    }
  };

  const handleToggleService = async (s: any) => {
    const res = await fetch("/api/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: s._id, isActive: !s.isActive }),
    });
    if (res.ok) {
      setServices((prev) =>
        prev.map((x) => x._id === s._id ? { ...x, isActive: !s.isActive } : x)
      );
      toast({
        title: s.isActive ? "Service hidden from users" : "Service is now visible to users",
      });
    }
  };

  const handleBookingStatus = async (id: string, status: string) => {
    const res = await fetch("/api/bookings", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) { setBookings((b) => b.map((x) => x._id === id ? { ...x, status } : x)); toast({ title: "Booking updated" }); }
  };

  const handleDeleteBooking = async (id: string) => {
    const res = await fetch("/api/bookings", {
      method: "DELETE", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ id }),
    });
    if (res.ok) { setBookings((b) => b.filter((x) => x._id !== id)); toast({ title: "Booking deleted" }); }
  };

  const handleOrderStatus = async (id: string, status: string) => {
    const res = await fetch("/api/orders", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) { setOrders((o) => o.map((x) => x._id === id ? { ...x, status } : x)); toast({ title: "Order updated" }); }
  };

  const handleDeleteOrder = async (id: string) => {
    const res = await fetch("/api/orders", {
      method: "DELETE", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ id }),
    });
    if (res.ok) { setOrders((o) => o.filter((x) => x._id !== id)); toast({ title: "Order deleted" }); }
  };

  // ===== MESSAGE HANDLERS =====
  const handleMarkRead = async (msg: IMessage) => {
    const res = await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: msg._id, isRead: !msg.isRead }),
    });
    if (res.ok) {
      setMessages((prev) =>
        prev.map((m) => m._id === msg._id ? { ...m, isRead: !msg.isRead } : m)
      );
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const res = await fetch("/api/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m._id !== id));
      toast({ title: "Message deleted." });
    }
  };

  // ── Stats ──────────────────────────────────────────────────────
  const activeBookings = bookings.filter((b) => ["pending", "confirmed"].includes(b.status)).length;
  const activeOrders = orders.filter((o) => ["pending", "processing", "shipped"].includes(o.status)).length;
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const unreadMessages = messages.filter((m) => !m.isRead).length; // ← new

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background relative pb-24">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-red-500/5 via-background to-background -z-10" />
        <div className="border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-40">
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Home</Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">Admin Dashboard</span>
            </div>
          </div>
        </div>

        <section className="py-16 md:py-24">
          <div className="container max-w-7xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-10 tracking-tight">Admin <span className="text-red-500">Dashboard</span></h1>

            {/* Stats – now 5 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
              <StatCard
                title="Total Revenue"
                value={`$${totalRevenue.toFixed(2)}`}
                loading={loading}
              />
              <StatCard
                title="Total Orders"
                value={orders.length.toString()}
                loading={loading}
              />
              <StatCard
                title="Total Bookings"
                value={bookings.length.toString()}
                loading={loading}
              />
              <StatCard
                title="Total Products"
                value={products.length.toString()}
                loading={loading}
              />
              <StatCard
                title="Unread Messages"
                value={unreadMessages.toString()}
                loading={loading}
              />
            </div>

            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="orders">
                  Orders
                  {activeOrders > 0 && (
                    <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                      {activeOrders}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="bookings">
                  Bookings
                  {activeBookings > 0 && (
                    <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                      {activeBookings}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="messages">
                  Messages
                  {unreadMessages > 0 && (
                    <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                      {unreadMessages}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* ── Products ── */}
              <TabsContent value="products" className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Manage Products</h2>
                  <Link href="/admin/products/add">
                    <Button><Plus className="w-4 h-4 mr-2" />Add Product</Button>
                  </Link>
                </div>
                {loading ? <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 rounded-xl bg-card/50 border border-border/50 animate-pulse"
                    />
                  ))}
                </div>
                  : products.length === 0 ? <p className="text-muted-foreground">No products yet.</p>
                    : (
                      <div className="space-y-4">
                        {products.map((p) => (
                          <AdminListRow
                            key={p._id}
                            id={p._id.toString()}
                            name={p.name}
                            metadata={`${p.category.charAt(0).toUpperCase() + p.category.slice(1)} — $${p.price.toFixed(2)}`}
                            isActive={p.isActive !== false}
                            hasToggle={true}
                            editUrl={`/admin/products/edit/${p._id}`}
                            viewUrl={`/products/${p._id}?from=dashboard&tab=products`}
                            onDelete={handleDeleteProduct}
                            onToggleActive={() => handleToggleProduct(p)}
                          />
                        ))}
                      </div>
                    )}
              </TabsContent>

              {/* ── Services ── */}
              <TabsContent value="services" className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Manage Services</h2>
                  <Link href="/admin/services/add">
                    <Button><Plus className="w-4 h-4 mr-2" />Add Service</Button>
                  </Link>
                </div>
                {loading ? <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 rounded-xl bg-card/50 border border-border/50 animate-pulse"
                    />
                  ))}
                </div>
                  : services.length === 0 ? <p className="text-muted-foreground">No services yet.</p>
                    : (
                      <div className="space-y-4">
                        {services.map((s) => (
                          <AdminListRow
                            key={s._id}
                            id={s._id.toString()}
                            name={s.name}
                            metadata={`${CATEGORY_LABELS[s.category] || s.category} — $${s.price} · ${s.duration} · ${s.location}`}
                            isActive={s.isActive !== false}
                            hasToggle={true}
                            editUrl={`/admin/services/edit/${s._id}`}
                            viewUrl={`/services/${s._id}?from=dashboard&tab=services`}
                            onDelete={handleDeleteService}
                            onToggleActive={() => handleToggleService(s)}
                          />
                        ))}
                      </div>
                    )}
              </TabsContent>

              {/* ── Orders ── */}
              <TabsContent value="orders" className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Manage Orders</h2>
                  <p className="text-sm text-muted-foreground">
                    {orders.length} total · {activeOrders} active
                  </p>
                </div>
                {loading ? <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 rounded-xl bg-card/50 border border-border/50 animate-pulse"
                    />
                  ))}
                </div>
                  : orders.length === 0 ? <p className="text-muted-foreground">No orders yet.</p>
                    : (
                      <div className="space-y-4">
                        {orders.map((o) => (
                          <Card key={o._id} className="athletic-card border-border/50 overflow-hidden hover:border-primary/50 transition-colors">
                            <CardContent className="p-5">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-bold text-primary">{o.orderNumber}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${ORDER_STATUS_COLORS[o.status] || ""}`}>
                                      {o.status}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {o.shippingAddress?.fullName} ·{" "}
                                    {new Date(o.createdAt).toLocaleDateString("en-US", {
                                      month: "short", day: "numeric", year: "numeric",
                                    })}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {o.shippingAddress?.address}, {o.shippingAddress?.city}, {o.shippingAddress?.country}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <p className="font-bold text-primary mr-2">${o.total?.toFixed(2)}</p>
                                  <Select value={o.status} onValueChange={(v) => handleOrderStatus(o._id, v)}>
                                    <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="processing">Processing</SelectItem>
                                      <SelectItem value="shipped">Shipped</SelectItem>
                                      <SelectItem value="delivered">Delivered</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <DeleteButton id={o._id} onDelete={handleDeleteOrder} />
                                </div>
                              </div>
                              <div className="border-t border-border pt-3 space-y-2">
                                {o.items?.map((item: any, i: number) => (
                                  <div key={i} className="flex items-center gap-3">
                                    <div className="relative w-9 h-9 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                                      {item.image
                                        ? <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        : <ShoppingBag className="w-4 h-4 text-muted-foreground m-auto mt-2.5" />}
                                    </div>
                                    <p className="text-sm flex-1 text-muted-foreground">
                                      {item.name} <span className="text-foreground font-medium">×{item.quantity}</span>
                                    </p>
                                    <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                ))}
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
                {loading ? <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 rounded-xl bg-card/50 border border-border/50 animate-pulse"
                    />
                  ))}
                </div>
                  : bookings.length === 0 ? <p className="text-muted-foreground">No bookings yet.</p>
                    : (
                      <div className="space-y-4">
                        {bookings.map((b) => (
                          <Card key={b._id} className="athletic-card border-border/50 overflow-hidden hover:border-primary/50 transition-colors">
                            <CardContent className="p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <p className="font-semibold">{b.fullName}</p>
                                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${BOOKING_STATUS_COLORS[b.status] || ""}`}>
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
                                <p className="text-xs text-muted-foreground mt-0.5">{b.email} · {b.phone}</p>
                                {b.notes && <p className="text-xs text-muted-foreground italic mt-1">"{b.notes}"</p>}
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Select value={b.status} onValueChange={(v) => handleBookingStatus(b._id, v)}>
                                  <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
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

              {/* ── Messages ── */}
              <TabsContent value="messages" className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Contact Messages</h2>
                  <p className="text-sm text-muted-foreground">
                    {messages.length} total · {unreadMessages} unread
                  </p>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-24 rounded-xl bg-card/50 border border-border/50 animate-pulse"
                      />
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-border rounded-xl">
                    <Mail className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-semibold">No messages yet.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Messages from the contact form will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <Card
                        key={msg._id}
                        className={`border-border/50 overflow-hidden transition-colors ${
                          !msg.isRead
                            ? "border-primary/30 bg-primary/5"
                            : "athletic-card"
                        }`}
                      >
                        <CardContent className="p-5">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            {/* Message content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <p className="font-bold text-base">{msg.name}</p>
                                {!msg.isRead && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {msg.email} ·{" "}
                                {new Date(msg.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                              <p className="text-sm font-semibold mb-2">
                                Subject: {msg.subject}
                              </p>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {msg.message}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 flex-shrink-0">
                              {/* Reply via email */}
                              <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  title="Reply via email"
                                  className="cursor-pointer"
                                >
                                  <Mail className="w-4 h-4" />
                                </Button>
                              </a>

                              {/* Mark read/unread */}
                              <Button
                                size="sm"
                                variant="outline"
                                title={msg.isRead ? "Mark as unread" : "Mark as read"}
                                onClick={() => handleMarkRead(msg)}
                                className={`cursor-pointer ${
                                  msg.isRead
                                    ? "text-muted-foreground"
                                    : "text-primary border-primary/30 hover:bg-primary/10"
                                }`}
                              >
                                {msg.isRead ? (
                                  <MailOpen className="w-4 h-4" />
                                ) : (
                                  <MailCheck className="w-4 h-4" />
                                )}
                              </Button>

                              {/* Delete */}
                              <DeleteButton id={msg._id} onDelete={handleDeleteMessage} />
                            </div>
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

function StatCard({
  title,
  value,
  loading = false,
}: {
  title: string;
  value: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card className="athletic-card border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3 flex-1">
              <div className="h-3 w-24 bg-secondary animate-pulse rounded-full" />
              <div className="h-9 w-32 bg-secondary animate-pulse rounded-lg" />
            </div>
            <div className="p-4 bg-secondary animate-pulse rounded-2xl ml-4">
              <div className="w-8 h-8" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="athletic-card border-border/50 hover:-translate-y-1 transition-transform duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
              {title}
            </p>
            <p className="text-4xl font-extrabold tracking-tight text-foreground">
              {value}
            </p>
          </div>
          <div className="p-4 bg-primary/10 rounded-2xl">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}