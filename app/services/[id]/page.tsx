// app/services/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Tag,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react";

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
  isActive: boolean;
  includes: string[];
}

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError  ] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [fromDashboard, setFromDashboard] = useState(false);
  const [dashboardTab, setDashboardTab] = useState("services");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      setFromDashboard(sp.get("from") === "dashboard");
      setDashboardTab(sp.get("tab") || "services");
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/services/${id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("not found");
        const data = await r.json();
        // Guard: make sure we got a real service object, not an error body
        if (!data._id) throw new Error("invalid response");
        setService(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBookNow = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book a service.",
        variant: "destructive",
      });
      router.push(`/auth?mode=login&callbackUrl=/services/booking?service=${id}`);
      return;
    }
    router.push(`/services/booking?service=${id}`);
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="container max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="h-96 rounded-xl bg-secondary animate-pulse" />
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 rounded bg-secondary animate-pulse"
                    style={{ width: `${85 - i * 10}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  /* ── Error / not found ── */
  if (error || !service) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Service not found</h1>
            <p className="text-muted-foreground">
              This service may have been removed or the link is incorrect.
            </p>
            <Link href="/services">
              <Button variant="outline">Back to Services</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const categoryLabel = CATEGORY_LABELS[service.category] || service.category;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">

        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              {fromDashboard ? (
                <>
                  <Link href={`/admin?tab=${dashboardTab}`} className="text-muted-foreground hover:text-foreground transition-colors font-semibold truncate hover:text-primary">
                    ← Back to Dashboard
                  </Link>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium truncate max-w-[200px]">{service.name}</span>
                </>
              ) : (
                <>
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    Home
                  </Link>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                    Services
                  </Link>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">{categoryLabel}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium truncate max-w-[200px]">{service.name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Detail */}
        <section className="py-12">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Image */}
              <div className="relative h-80 lg:h-[480px] rounded-xl overflow-hidden bg-secondary border border-border">
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.name ?? "Service image"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <span className="absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm font-medium">
                  {categoryLabel}
                </span>
              </div>

              {/* Info */}
              <div className="lg:sticky lg:top-24 flex flex-col space-y-6 self-start pb-8">
                <div>
                  <p className="text-sm text-muted-foreground capitalize mb-1 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {categoryLabel}
                  </p>
                  <h1 className="text-3xl font-bold leading-tight">{service.name}</h1>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">${service.price}</span>
                  <span className="text-muted-foreground text-sm">/ session</span>
                </div>

                {/* Description */}
                <div>
                  <div className={`relative overflow-hidden transition-all duration-300 ${!isDescExpanded ? 'line-clamp-4' : ''}`}>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{service.description}</p>
                    {!isDescExpanded && (
                      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background to-transparent" />
                    )}
                  </div>
                  <button 
                    onClick={() => setIsDescExpanded(!isDescExpanded)} 
                    className="mt-2 text-[#FF531A] hover:text-[#FF531A]/80 font-medium text-sm transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {isDescExpanded ? "Show less" : "Read more"}
                  </button>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-medium text-sm">{service.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium text-sm">{service.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3">
                    <Users className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Capacity</p>
                      <p className="font-medium text-sm">
                        {service.capacity === 1
                          ? "1-on-1 session"
                          : `Up to ${service.capacity} people`}
                      </p>
                    </div>
                  </div>

                </div>

                {/* What's included — only show if the service has items */}
                {service.includes?.length > 0 && (
                  <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                    <h3 className="font-semibold text-sm">What&apos;s included</h3>
                    <ul className="space-y-2">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <Button
                  size="lg"
                  className="w-full gap-2"
                  
                  onClick={handleBookNow}
                >
                  <CalendarCheck className="w-5 h-5" />
                  Book This Service
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Back */}
        <section className="pb-12">
          <div className="container max-w-7xl mx-auto px-4">
            <Link href="/services">
              <Button variant="outline" className="gap-2">
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to All Services
              </Button>
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
