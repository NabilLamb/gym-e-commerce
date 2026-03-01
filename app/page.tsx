import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Dumbbell, Pill, Shirt } from 'lucide-react'
import { products, services } from '@/lib/dummy-data'

export default function Home() {
  const featuredProducts = products.slice(0, 6)
  const featuredServices = services.slice(0, 3)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                  Transform Your Fitness Journey
                </h1>
                <p className="text-xl text-muted-foreground mb-8 text-balance">
                  Premium gym equipment, supplements, and expert fitness services to help you reach your goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/products">
                    <Button size="lg" className="w-full sm:w-auto">
                      Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                      Book Services
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex-1">
                <div className="w-full h-72 md:h-96 bg-secondary rounded-2xl flex items-center justify-center">
                  <Dumbbell className="w-32 h-32 text-primary/20" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-card border-b border-border">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop By Category</h2>
              <p className="text-muted-foreground text-lg">Everything you need for your fitness journey</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Equipment Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <Dumbbell className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle>Gym Equipment</CardTitle>
                  <CardDescription>Dumbbells, barbells, mats & more</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Link href="/products?category=equipment">
                    <Button variant="outline" className="w-full bg-transparent">
                      Shop Equipment
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Supplements Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <Pill className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle>Supplements</CardTitle>
                  <CardDescription>Protein, BCAA, Creatine & more</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Link href="/products?category=supplements">
                    <Button variant="outline" className="w-full bg-transparent">
                      Shop Supplements
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Clothes Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <Shirt className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle>Athletic Wear</CardTitle>
                  <CardDescription>Shirts, shorts, leggings & more</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Link href="/products?category=clothes">
                    <Button variant="outline" className="w-full bg-transparent">
                      Shop Clothes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
                <p className="text-muted-foreground">Bestsellers and customer favorites</p>
              </div>
              <Link href="/products">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-all hover:translate-y-[-4px]">
                  <CardContent className="p-0">
                    <div className="w-full h-48 bg-secondary rounded-t-lg flex items-center justify-center overflow-hidden">
                      <div className="text-muted-foreground text-sm">{product.name}</div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-1">
                          <span className="text-sm font-semibold">★</span>
                          <span className="text-sm text-muted-foreground">
                            {product.rating} ({product.reviews} reviews)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm line-through text-muted-foreground ml-2">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button className="w-full mt-4">Add to Cart</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-20 bg-card border-y border-border">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Our Services</h2>
                <p className="text-muted-foreground">Expert guidance and premium fitness services</p>
              </div>
              <Link href="/services">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredServices.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-all hover:translate-y-[-4px]">
                  <CardContent className="p-0">
                    <div className="w-full h-40 bg-secondary rounded-t-lg flex items-center justify-center">
                      <div className="text-muted-foreground text-sm">{service.name}</div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-primary">${service.price}</span>
                          <span className="text-xs text-muted-foreground ml-2">{service.duration}</span>
                        </div>
                      </div>
                      <Link href="/services">
                        <Button className="w-full">Book Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="bg-primary/5 rounded-2xl p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Fitness Journey?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers and transform your life with our premium equipment and expert guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button size="lg">Shop Now</Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline">
                    Book a Service
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
