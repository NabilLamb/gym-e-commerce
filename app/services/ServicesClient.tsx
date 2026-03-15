// app/services/ServicesClient.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Clock, MapPin, Users } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  "personal-training": "Personal Training",
  "group-class":       "Group Class",
  "facility-access":   "Facility Access",
  "assessment":        "Assessment",
  "online-coaching":   "Online Coaching",
};

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  capacity: number;
  location: string;
  image: string;
}

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices]                 = useState<Service[]>([]);
  const [loading, setLoading]                   = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    "all",
    ...Array.from(new Set(services.map((s) => s.category).filter(Boolean))),
  ];

  const filtered =
    selectedCategory === "all"
      ? services
      : services.filter((s) => s.category === selectedCategory);

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
              <span className="text-foreground">Services</span>
            </div>
          </div>
        </div>

        {/* Page header */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-[10%] w-[30%] h-full rounded-full bg-blue-500/10 blur-[120px] -z-10" />
          <div className="container max-w-7xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Our <span className="text-primary">Services</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium">
              Professional training, coaching, and fitness services to accelerate your progress.
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="py-8">
          <div className="container max-w-7xl mx-auto px-4">

            {/* Category filter */}
            {!loading && categories.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                    }`}
                  >
                    {cat === "all" ? "All Services" : CATEGORY_LABELS[cat] || cat}
                  </button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border h-80 animate-pulse bg-secondary"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                No services available yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((service) => (
                  <Link
                    key={service._id}
                    href={`/services/${service._id}`}
                    className="group block h-full"
                  >
                    <Card className="athletic-card h-full flex flex-col rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-border/50">
                      <CardContent className="p-0 flex flex-col h-full relative">

                        {/* Image */}
                        <div className="relative w-full h-44 bg-secondary overflow-hidden flex-shrink-0">
                          <Image
                            src={service.image || "/placeholder.svg"}
                            alt={service.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            {CATEGORY_LABELS[service.category] || service.category}
                          </span>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                            {service.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                            {service.description}
                          </p>

                          {/* Meta */}
                          <div className="space-y-1.5 mb-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                              {service.duration}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                              {service.location}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="w-3.5 h-3.5 flex-shrink-0" />
                              {service.capacity === 1
                                ? "1-on-1 session"
                                : `Up to ${service.capacity} people`}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-2xl font-bold text-primary">
                              ${service.price}
                            </span>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(
                                  `/services/booking?service=${service._id}`
                                );
                              }}
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 relative overflow-hidden border-y border-border/50 bg-secondary/20">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <div className="container max-w-7xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
              Ready to <span className="text-primary">Transform?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto font-medium">
              Join our expert trainers today. Elevate your performance.
            </p>
            <Link href="/services/booking">
              <Button
                size="lg"
                className="h-16 px-10 text-xl font-bold rounded-full shadow-lg hover:scale-105 transition-all w-full sm:w-auto cursor-pointer"
              >
                Schedule Your Session
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}