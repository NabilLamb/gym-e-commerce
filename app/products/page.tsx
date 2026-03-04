"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";

type Category = "all" | "equipment" | "supplements" | "clothes";
type SortOption = "featured" | "price-low" | "price-high" | "rating";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

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
    let filtered =
      selectedCategory === "all"
        ? products
        : products.filter((p) => p.category === selectedCategory);

    const sorted = [...filtered];
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
    return sorted;
  }, [selectedCategory, sortBy, products]);

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
                        [
                          "all",
                          "equipment",
                          "supplements",
                          "clothes",
                        ] as const
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
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="border border-border rounded-lg h-80 animate-pulse bg-secondary"
                      />
                    ))}
                  </div>
                ) : (
                  <ProductGrid products={filteredAndSortedProducts} />
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
