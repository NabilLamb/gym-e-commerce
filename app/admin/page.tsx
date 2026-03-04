"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { ChevronRight, Plus, Edit, BarChart3 } from "lucide-react";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default function AdminPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  // Fetch data
  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const fetchServices = async () => {
    const res = await fetch("/api/services");
    const data = await res.json();
    setServices(data);
  };

  useEffect(() => {
    Promise.all([fetchProducts(), fetchServices()]).finally(() =>
      setLoading(false),
    );
  }, []);

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setProducts(products.filter((p) => p._id !== id));
      toast({
        title: "Product deleted",
        description: "The product has been removed.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await fetch("/api/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete");

      setServices(services.filter((s) => s._id !== id));
      toast({
        title: "Service deleted",
        description: "The service has been removed.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete service.",
        variant: "destructive",
      });
    }
  };

  const handleServiceSuccess = () => {
    fetchServices();
    setServiceDialogOpen(false);
    setEditingService(null);
  };

  // Stats
  const totalRevenue = 1234.56;
  const totalOrders = 42;
  const totalBookings = 18;
  const totalProducts = products.length;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground"
              >
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">
                Admin Dashboard
              </span>
            </div>
          </div>
        </div>

        <section className="py-12">
          <div className="container max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard
                title="Total Revenue"
                value={`$${totalRevenue.toFixed(2)}`}
              />
              <StatCard title="Total Orders" value={totalOrders.toString()} />
              <StatCard
                title="Total Bookings"
                value={totalBookings.toString()}
              />
              <StatCard
                title="Total Products"
                value={totalProducts.toString()}
              />
            </div>

            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="orders">Orders & Bookings</TabsTrigger>
              </TabsList>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Manage Products</h2>
                  <Link href="/admin/products/add">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </Link>
                </div>

                {loading ? (
                  <p>Loading products...</p>
                ) : (
                  <div className="space-y-2">
                    {products.map((product) => (
                      <Card key={product._id}>
                        <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.category} - ${product.price}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/admin/products/edit/${product._id}`}>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <DeleteButton
                              id={product._id}
                              onDelete={handleDeleteProduct}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Manage Services</h2>
                  <Dialog
                    open={serviceDialogOpen}
                    onOpenChange={setServiceDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingService(null)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingService ? "Edit Service" : "Add New Service"}
                        </DialogTitle>
                      </DialogHeader>
                      <ServiceForm
                        service={editingService}
                        onSuccess={handleServiceSuccess}
                        onCancel={() => {
                          setServiceDialogOpen(false);
                          setEditingService(null);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                {loading ? (
                  <p>Loading services...</p>
                ) : (
                  <div className="space-y-2">
                    {services.map((service) => (
                      <Card key={service._id}>
                        <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <p className="font-semibold">{service.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ${service.price} - {service.duration}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingService(service);
                                setServiceDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <DeleteButton
                              id={service._id}
                              onDelete={handleDeleteService}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Orders & Bookings Tab */}
              <TabsContent value="orders" className="space-y-6">
                <p className="text-muted-foreground">
                  Orders and bookings will be implemented soon.
                </p>
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
