"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Loader2,
  QrCode,
} from "lucide-react";

import { validateName, validateEmail, validatePhone } from "@/lib/validations";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  capacity: number;
}

export default function BookingPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const preselectedId = searchParams.get("service") || "";

  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const [formData, setFormData] = useState({
    serviceId: preselectedId,
    fullName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => {
        setServices(data);
        if (!preselectedId && data.length > 0) {
          setFormData((prev) => ({ ...prev, serviceId: data[0]._id }));
        }
      })
      .catch(console.error)
      .finally(() => setLoadingServices(false));
  }, [preselectedId]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const selectedService = services.find((s) => s._id === formData.serviceId);
  const today = new Date().toISOString().split("T")[0];

  // 1. New validation function inside the component
  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.serviceId) errors.push("Please select a service.");
    
    const nameErr = validateName(formData.fullName);
    if (nameErr) errors.push(nameErr);
    
    const emailErr = validateEmail(formData.email);
    if (emailErr) errors.push(emailErr);
    
    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) errors.push(phoneErr);
    
    if (!formData.date) errors.push("Please select a date.");
    if (!formData.time) errors.push("Please select a time.");

    if (errors.length > 0) {
      toast({
        title: "Please fix the following:",
        description: errors[0], // Shows the first error found
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 2. Run validation before proceeding
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Booking failed");
      }

      const data = await res.json();
      setConfirmedBooking(data);
    } catch (err: any) {
      toast({ title: "Booking failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Confirmation screen ──────────────────────────────────────
  if (confirmedBooking) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background py-12">
          <div className="container max-w-2xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-3">Booking Received!</h1>
            <p className="text-muted-foreground mb-8">
              We'll confirm your booking shortly. Show your check-in code at the front desk.
            </p>

            <Card className="mb-8 text-left">
              <CardContent className="p-6 space-y-5">
                <div className="flex flex-col items-center bg-primary/5 border border-primary/20 rounded-xl p-5">
                  <QrCode className="w-8 h-8 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Check-in Code</p>
                  <p className="text-3xl font-bold tracking-widest text-primary">
                    {confirmedBooking.checkInCode}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Show this code when you arrive
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Service</p>
                    <p className="font-semibold">{confirmedBooking.serviceName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</p>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                      Pending Confirmation
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Date</p>
                    <p className="font-semibold">
                      {new Date(confirmedBooking.date).toLocaleDateString("en-US", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Time</p>
                    <p className="font-semibold">{confirmedBooking.time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Name</p>
                    <p className="font-semibold">{confirmedBooking.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Email</p>
                    <p className="font-semibold text-sm">{confirmedBooking.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services">
                <Button variant="outline">View More Services</Button>
              </Link>
              <Link href="/profile">
                <Button>View My Bookings</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Booking form ──────────────────────────────────────────────
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Link href="/services" className="text-muted-foreground hover:text-foreground">Services</Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Book a Session</span>
            </div>
          </div>
        </div>

        <section className="py-12">
          <div className="container max-w-2xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-8">Book a Service</h1>

            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingServices ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div>
                      <Label>Select Service</Label>
                      <Select
                        value={formData.serviceId}
                        onValueChange={(v) => setFormData((prev) => ({ ...prev, serviceId: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a service..." />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((s) => (
                            <SelectItem key={s._id} value={s._id}>
                              {s.name} — ${s.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedService && (
                      <div className="bg-secondary rounded-lg p-4 space-y-2">
                        <p className="font-medium">{selectedService.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedService.description}</p>
                        <div className="flex flex-wrap gap-4 pt-1">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" /> {selectedService.duration}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" /> {selectedService.location}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="w-3 h-3" />
                            {selectedService.capacity === 1
                              ? "1-on-1 session"
                              : `Up to ${selectedService.capacity} people`}
                          </span>
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" name="fullName" value={formData.fullName}
                        onChange={handleChange} placeholder="John Doe" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" value={formData.email}
                        onChange={handleChange} placeholder="john@example.com" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" value={formData.phone}
                        onChange={handleChange} placeholder="+1 (555) 000-0000" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Preferred Date</Label>
                        <Input id="date" name="date" type="date" min={today}
                          value={formData.date} onChange={handleChange} />
                      </div>
                      <div>
                        <Label htmlFor="time">Preferred Time</Label>
                        <Input id="time" name="time" type="time"
                          value={formData.time} onChange={handleChange} />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">
                        Notes{" "}
                        <span className="text-muted-foreground font-normal text-sm">(optional)</span>
                      </Label>
                      <Textarea id="notes" name="notes" value={formData.notes}
                        onChange={handleChange} rows={3} className="resize-none"
                        placeholder="Any injuries, goals, or special requests..." />
                    </div>

                    {selectedService && (
                      <div className="border-t border-border pt-4 flex justify-between items-center">
                        <span className="text-muted-foreground">Session price</span>
                        <span className="text-2xl font-bold text-primary">${selectedService.price}</span>
                      </div>
                    )}

                    <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                      {submitting ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Confirming...</>
                      ) : (
                        "Confirm Booking"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}