'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { services } from '@/lib/dummy-data'
import { CheckCircle, ChevronRight } from 'lucide-react'

export default function BookingPage() {
  const searchParams = useSearchParams()
  const selectedServiceId = searchParams.get('service')
  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0]

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: selectedServiceId || services[0].id,
    date: '',
    time: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [bookingId] = useState(`BK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background py-12">
          <div className="container max-w-2xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-16 h-16 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Booking Confirmed!</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Your service booking has been successfully confirmed. Check your email for more details.
              </p>

              <Card className="bg-card border border-border mb-8">
                <CardContent className="p-6">
                  <div className="space-y-4 text-left">
                    <div>
                      <p className="text-sm text-muted-foreground">Booking ID</p>
                      <p className="text-2xl font-bold text-primary">{bookingId}</p>
                    </div>
                    <div className="border-t border-border pt-4">
                      <p className="text-sm text-muted-foreground">Service</p>
                      <p className="font-semibold">{services.find((s) => s.id === formData.service)?.name}</p>
                    </div>
                    <div className="border-t border-border pt-4">
                      <p className="text-sm text-muted-foreground">Scheduled Date & Time</p>
                      <p className="font-semibold">
                        {formData.date} at {formData.time}
                      </p>
                    </div>
                    <div className="border-t border-border pt-4">
                      <p className="text-sm text-muted-foreground">Instructor Name</p>
                      <p className="font-semibold">{formData.fullName}</p>
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
          </div>
        </main>
        <Footer />
      </>
    )
  }

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
              <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                Services
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Booking</span>
            </div>
          </div>
        </div>

        <section className="py-12">
          <div className="container max-w-2xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-8">Book a Service</h1>

            <Card>
              <CardHeader>
                <CardTitle>Booking Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Selection */}
                  <div>
                    <Label htmlFor="service">Select Service</Label>
                    <Select value={formData.service} onValueChange={(v) => handleSelectChange('service', v)}>
                      <SelectTrigger id="service">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - ${service.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Service Details */}
                  {services.find((s) => s.id === formData.service) && (
                    <div className="bg-secondary p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {services.find((s) => s.id === formData.service)?.description}
                      </p>
                    </div>
                  )}

                  {/* Personal Information */}
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Preferred Time</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <Button type="submit" size="lg" className="w-full">
                    Confirm Booking
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
