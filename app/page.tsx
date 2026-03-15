// app/page.tsx

import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Dumbbell, Pill, Shirt } from "lucide-react";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ServiceCard } from "@/components/home/ServiceCard";

async function getFeaturedServices() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slice(0, 3);
  } catch {
    return [];
  }
}

export default async function Home() {
  const featuredServices = await getFeaturedServices();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-20 md:py-32">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-3xl opacity-50 animate-pulse" />
            <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-3xl opacity-50 animate-pulse delay-700" />
          </div>
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-balance leading-tight tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">Transform</span> Your Fitness Journey
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance font-medium">
                  Premium gym equipment, supplements, and expert fitness services to help you reach your maximum potential.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/products" className="group">
                    <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40">
                      Shop Now <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-background/50 backdrop-blur-sm border-2 hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105">
                      Book Services
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex-1 w-full mt-10 md:mt-0 relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary to-blue-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative w-full h-80 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                  <Image
                    src="/image-hero.png"
                    alt="Gym Hero"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-24 bg-card border-b border-border/50 relative">
          <div className="container max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Shop By Category</h2>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto">Everything you need for your fitness journey, curated by professionals.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border-border/50 bg-background/50 backdrop-blur hover:-translate-y-2">
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-6">
                    <div className="p-5 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Dumbbell className="w-10 h-10 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">Gym Equipment</CardTitle>
                  <CardDescription className="text-base mt-2">Dumbbells, barbells, mats & premium gear</CardDescription>
                </CardHeader>
                <CardContent className="text-center pt-6">
                  <Link href="/products?category=equipment">
                    <Button variant="outline" className="w-full text-lg h-12 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all">Shop Equipment</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border-border/50 bg-background/50 backdrop-blur hover:-translate-y-2">
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-6">
                    <div className="p-5 bg-blue-500/10 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                      <Pill className="w-10 h-10 text-blue-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">Supplements</CardTitle>
                  <CardDescription className="text-base mt-2">Protein, BCAA, Creatine & recovery</CardDescription>
                </CardHeader>
                <CardContent className="text-center pt-6">
                  <Link href="/products?category=supplements">
                    <Button variant="outline" className="w-full text-lg h-12 rounded-xl group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-all">Shop Supplements</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border-border/50 bg-background/50 backdrop-blur hover:-translate-y-2">
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-6">
                    <div className="p-5 bg-purple-500/10 rounded-2xl group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                      <Shirt className="w-10 h-10 text-purple-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">Athletic Wear</CardTitle>
                  <CardDescription className="text-base mt-2">Shirts, shorts, leggings & accessories</CardDescription>
                </CardHeader>
                <CardContent className="text-center pt-6">
                  <Link href="/products?category=clothes">
                    <Button variant="outline" className="w-full text-lg h-12 rounded-xl group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-500 transition-all">Shop Clothes</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <FeaturedProducts />

        {/* Services */}
        <section className="py-24 bg-background relative overflow-hidden text-clip">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
          <div className="container max-w-7xl mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Our Premium Services</h2>
                <p className="text-muted-foreground text-xl">Expert guidance, personal training, and premium fitness services tailored to your specific goals.</p>
              </div>
              <Link href="/services" className="group">
                <Button variant="outline" size="lg" className="rounded-full text-lg h-12 px-6 group-hover:bg-primary group-hover:text-primary-foreground border-2">
                  View All Services <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredServices.length > 0 ? (
                featuredServices.map((service: any) => (
                  <ServiceCard key={service._id} service={service} />
                ))
              ) : (
                <p className="text-muted-foreground col-span-3 text-center py-12 text-lg">
                  No services available yet.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full max-h-lg bg-primary/20 blur-[100px] rounded-full" />

          <div className="container max-w-7xl mx-auto px-4 relative z-10">
            <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-12 md:p-20 text-center shadow-2xl">
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                Ready to Start Your <span className="text-primary tracking-tight">Fitness Journey?</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto font-medium">
                Join thousands of satisfied customers and transform your life with our premium equipment and expert guidance today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/products">
                  <Button size="lg" className="h-16 px-10 text-xl font-bold rounded-full w-full sm:w-auto shadow-lg shadow-primary/25 hover:scale-105 transition-all">
                    Shop Gear Now
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="secondary" className="h-16 px-10 text-xl font-bold rounded-full w-full sm:w-auto hover:bg-background transition-all hover:scale-105 border border-border">
                    Book a Trainer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}