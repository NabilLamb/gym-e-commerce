//components\products\ProductCard.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Star } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  description?: string;
  averageRating?: number;
  numReviews?: number;
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const mainImage = product.images?.[0] || "/placeholder.svg";

  // Calculate discount percentage — same logic as FeaturedProducts
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : null;

  const hasReviews = product.numReviews && product.numReviews > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: mainImage,
      quantity: 1,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Link href={`/products/${product._id}`} className="group block h-full">
      <div className="athletic-card h-full flex flex-col rounded-2xl">

        {/* Image */}
        <div className="relative h-52 w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden rounded-t-2xl">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
          {/* Discount badge — consistent with FeaturedProducts */}
          {discount && (
            <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <p className="text-xs text-muted-foreground capitalize mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-base leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {product.description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {hasReviews ? (
              <>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= Math.round(product.averageRating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {product.averageRating?.toFixed(1)} ({product.numReviews})
                </span>
              </>
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
              {discount && (
                <span className="text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  Save {discount}%
                </span>
              )}
            </div>
            <Button
              onClick={handleAddToCart}
              className="w-full cursor-pointer"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}