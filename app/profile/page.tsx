'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { sampleOrders, sampleBookings } from '@/lib/dummy-data'
import { ChevronRight, Edit, Package, Calendar } from 'lucide-react'

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false)
  const [userInfo, setUserInfo] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, New York, NY 10001',
  })

  const [tempUserInfo, setTempUserInfo] = useState(userInfo)

  const handleSave = () => {
    setUserInfo(tempUserInfo)
    setEditMode(false)
  }

  const handleCancel = () => {
    setTempUserInfo(userInfo)
    setEditMode(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTempUserInfo((prev) => ({ ...prev, [name]: value }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-primary'
      case 'shipping':
      case 'upcoming':
        return 'text-blue-600'
      case 'processing':
        return 'text-yellow-600'
      case 'cancelled':
        return 'text-destructive'
      default:
        return 'text-foreground'
    }
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
              <span className="text-foreground font-medium">Profile</span>
            </div>
          </div>
        </div>

        <section className="py-12">
          <div className="container max-w-6xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-8">My Account</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {editMode ? (
                      <form className="space-y-4">
                        <div>
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={tempUserInfo.fullName}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={tempUserInfo.email}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={tempUserInfo.phone}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            value={tempUserInfo.address}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSave} className="flex-1">
                            Save
                          </Button>
                          <Button onClick={handleCancel} variant="outline" className="flex-1 bg-transparent">
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                          <p className="font-semibold">{userInfo.fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Email</p>
                          <p className="font-semibold">{userInfo.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Phone</p>
                          <p className="font-semibold">{userInfo.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Address</p>
                          <p className="font-semibold text-sm">{userInfo.address}</p>
                        </div>
                        <Button
                          onClick={() => {
                            setTempUserInfo(userInfo)
                            setEditMode(true)
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Orders and Bookings */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="orders" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="orders">
                      <Package className="w-4 h-4 mr-2" />
                      Orders
                    </TabsTrigger>
                    <TabsTrigger value="bookings">
                      <Calendar className="w-4 h-4 mr-2" />
                      Bookings
                    </TabsTrigger>
                  </TabsList>

                  {/* Orders Tab */}
                  <TabsContent value="orders" className="space-y-4">
                    {sampleOrders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Order ID</p>
                              <p className="font-semibold text-lg">{order.id}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Date</p>
                              <p className="font-semibold">{order.date}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Status</p>
                              <p className={`font-semibold capitalize ${getStatusColor(order.status)}`}>
                                {order.status}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Total</p>
                              <p className="text-2xl font-bold text-primary">${order.total.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="border-t border-border pt-4">
                            <p className="text-sm font-semibold mb-3">Items:</p>
                            <ul className="space-y-2">
                              {order.items.map((item, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground">
                                  {item.product} x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  {/* Bookings Tab */}
                  <TabsContent value="bookings" className="space-y-4">
                    {sampleBookings.map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Service</p>
                              <p className="font-semibold">{booking.service}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Date & Time</p>
                              <p className="font-semibold">{booking.date} at {booking.time}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Status</p>
                              <p className={`font-semibold capitalize ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </p>
                            </div>
                            <Link href="/services/booking">
                              <Button variant="outline">Rebook</Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
