"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

type Category = "all" | "equipment" | "supplements" | "clothes";
type SortOption = "featured" | "price-low" | "price-high" | "rating";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    let sorted = [...filtered];
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return sorted;
  }, [selectedCategory, sortBy, products]);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="container max-w-7xl mx-auto px-4 py-12">
            <p>Loading products...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Products</span>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <section className="py-12 border-b border-border">
          <div className="container max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Our Products</h1>
            <p className="text-xl text-muted-foreground">
              Browse our complete selection of gym equipment, supplements, and
              athletic wear
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <div className="lg:w-64 flex-shrink-0">
                <div className="bg-card rounded-lg p-6 border border-border sticky top-24">
                  <h3 className="font-semibold text-lg mb-4">Filters</h3>

                  {/* Category Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-sm mb-3">Category</h4>
                    <div className="space-y-2">
                      {(
                        ["all", "equipment", "supplements", "clothes"] as const
                      ).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            selectedCategory === cat
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-secondary text-foreground"
                          }`}
                        >
                          {cat === "all"
                            ? "All Categories"
                            : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <h4 className="font-medium text-sm mb-3">Sort By</h4>
                    <Select
                      value={sortBy}
                      onValueChange={(v) => setSortBy(v as SortOption)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-low">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="price-high">
                          Price: High to Low
                        </SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="flex-1">
                <div className="mb-6 text-sm text-muted-foreground">
                  Showing {filteredAndSortedProducts.length} products
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedProducts.map((product) => (
                    <Card
                      key={product._id}
                      className="hover:shadow-lg transition-all hover:translate-y-[-4px]"
                    >
                      <CardContent className="p-0">
                        <div className="relative h-48 w-full bg-secondary rounded-t-lg overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-1 mb-2">
                            <span className="text-sm font-semibold">★</span>
                            <span className="text-sm text-muted-foreground">
                              {product.rating} ({product.reviews} reviews)
                            </span>
                          </div>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="text-2xl font-bold text-primary">
                                ${product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm line-through text-muted-foreground ml-2">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleAddToCart(product)}
                            className="w-full"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredAndSortedProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No products found. Try adjusting your filters.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
