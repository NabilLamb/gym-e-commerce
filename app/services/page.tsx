'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { services } from '@/lib/dummy-data'
import { ChevronRight, Clock } from 'lucide-react'
import { useState } from 'react'

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)

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
              <span className="text-foreground font-medium">Services</span>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <section className="py-12 border-b border-border">
          <div className="container max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Our Services</h1>
            <p className="text-xl text-muted-foreground">
              Professional training, coaching, and fitness services to accelerate your progress
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="hover:shadow-lg transition-all hover:translate-y-[-4px] cursor-pointer"
                  onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                >
                  <CardContent className="p-0">
                    <div className="w-full h-40 bg-secondary rounded-t-lg flex items-center justify-center">
                      <div className="text-muted-foreground text-sm text-center px-4">{service.name}</div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Clock className="w-4 h-4" />
                        {service.duration}
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-3xl font-bold text-primary">${service.price}</span>
                        </div>
                        <Link href={`/services/booking?service=${service.id}`}>
                          <Button>Book Now</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-card border-y border-border">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started Today</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our expert trainers and nutritionists are ready to help you achieve your fitness goals. 
                Book your first session now and receive a free consultation.
              </p>
              <Link href="/services/booking">
                <Button size="lg">Schedule Your Service</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
