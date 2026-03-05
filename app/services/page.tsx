// app/services/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Clock, MapPin, Users, Tag } from "lucide-react";

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
  const [services, setServices]               = useState<Service[]>([]);
  const [loading, setLoading]                 = useState(true);
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
      <main className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Services</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <section className="py-12 border-b border-border">
          <div className="container max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Our Services</h1>
            <p className="text-xl text-muted-foreground">
              Professional training, coaching, and fitness services to accelerate your progress
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="py-12">
          <div className="container max-w-7xl mx-auto px-4">

            {/* Category filter */}
            {!loading && categories.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
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
                  <div key={i} className="rounded-xl border border-border h-80 animate-pulse bg-secondary" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">No services available yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((service) => (
                  <Card key={service._id} className="hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
                    <CardContent className="p-0 flex flex-col h-full">
                      {/* Image */}
                      <div className="relative w-full h-44 bg-secondary overflow-hidden flex-shrink-0">
                        <Image
                          src={service.image || "/placeholder.svg"}
                          alt={service.name}
                          fill
                          className="object-cover"
                        />
                        {/* Category badge */}
                        <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                          {CATEGORY_LABELS[service.category] || service.category}
                        </span>
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
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
                            {service.capacity === 1 ? "1-on-1 session" : `Up to ${service.capacity} people`}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-2xl font-bold text-primary">${service.price}</span>
                          <Link href={`/services/booking?service=${service._id}`}>
                            <Button size="sm">Book Now</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-card border-y border-border">
          <div className="container max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started Today</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Our expert trainers are ready to help you reach your goals.
            </p>
            <Link href="/services/booking">
              <Button size="lg">Schedule Your Session</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
