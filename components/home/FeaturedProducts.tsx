// components/home/FeaturedProducts.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Star, ShoppingCart, ArrowRight } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  averageRating: number;
  numReviews: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-border overflow-hidden animate-pulse">
      <div className="h-52 bg-secondary" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-secondary rounded w-3/4" />
        <div className="h-3 bg-secondary rounded w-full" />
        <div className="h-3 bg-secondary rounded w-2/3" />
        <div className="h-8 bg-secondary rounded mt-4" />
      </div>
    </div>
  );
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/products/featured?limit=6")
      .then((r) => r.json())
      .then((data) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "/placeholder.svg",
      quantity: 1,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <section className="py-16">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold">Bestsellers & Top Rated</h2>
            <p className="text-muted-foreground mt-1">
              Most sold and highest reviewed by our community
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? [...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product) => {
                const mainImage = product.images?.[0] || "/placeholder.svg";
                const discount = product.originalPrice
                  ? Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )
                  : null;

                return (
                  <Link
                    key={product._id}
                    href={`/products/${product._id}`}
                    className="group block"
                  >
                    <div className="rounded-xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-card h-full flex flex-col">
                      {/* Image */}
                      <div className="relative h-52 w-full bg-secondary overflow-hidden">
                        <Image
                          src={mainImage}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {discount && (
                          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                            -{discount}%
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 flex flex-col flex-1">
                        <p className="text-xs text-muted-foreground capitalize mb-1">
                          {product.category}
                        </p>
                        <h3 className="font-semibold text-base leading-tight mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {product.description}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <StarRating rating={product.averageRating} />
                          {product.numReviews > 0 ? (
                            <span className="text-xs text-muted-foreground">
                              {product.averageRating.toFixed(1)} (
                              {product.numReviews})
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              No reviews yet
                            </span>
                          )}
                        </div>

                        {/* Price + Button */}
                        <div className="mt-auto">
                          <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-xl font-bold text-primary">
                              ${product.price.toFixed(2)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm line-through text-muted-foreground">
                                ${product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <Button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="w-full gap-2"
                            size="sm"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p>No products available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
