// app/products/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronRight,
  Star,
  ShoppingCart,
  Package,
  Tag,
  MessageSquare,
  X,
} from "lucide-react";

interface Variant {
  size?: string;
  color?: string;
  stock: number;
  sku?: string;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  video?: string;
  stock: number;
  variants?: Variant[];
  averageRating: number;
  numReviews: number;
}

interface Review {
  _id: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  edited: boolean;
  createdAt: string;
  user: string;
}

function StarRating({
  rating,
  interactive = false,
  onRate,
}: {
  rating: number;
  interactive?: boolean;
  onRate?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 transition-colors ${
            star <= (interactive ? hovered || rating : rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted-foreground/30"
          } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
        />
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [fromDashboard, setFromDashboard] = useState(false);
  const [dashboardTab, setDashboardTab] = useState("products");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      setFromDashboard(sp.get("from") === "dashboard");
      setDashboardTab(sp.get("tab") || "products");
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/products/${id}`).then((r) => r.json()),
      fetch(`/api/products/${id}/reviews`).then((r) => r.json()),
    ])
      .then(([productData, reviewsData]) => {
        setProduct(productData);
        setReviews(reviewsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "/placeholder.svg",
      quantity,
    });
    toast({
      title: "Added to cart",
      description: `${quantity}× ${product.name} added to your cart.`,
    });
  };

  const handleSubmitReview = async () => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }
    if (rating === 0) {
      toast({ title: "Select a rating", description: "Please select between 1 and 5 stars.", variant: "destructive" });
      return;
    }
    if (comment.trim().length < 5) {
      toast({ title: "Comment too short", description: "Please write at least 5 characters.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const isEditing = !!editingReview;
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      const updatedReview = await res.json();

      if (isEditing) {
        setReviews((prev) =>
          prev.map((r) => (r._id === updatedReview._id ? updatedReview : r))
        );
      } else {
        setReviews((prev) => [updatedReview, ...prev]);
      }

      setRating(0);
      setComment("");
      setEditingReview(null);

      // Recalculate average locally
      const allReviews = isEditing
        ? reviews.map((r) => (r._id === updatedReview._id ? updatedReview : r))
        : [...reviews, updatedReview];
      const avg = allReviews.reduce((a, b) => a + b.rating, 0) / allReviews.length;
      setProduct((prev) =>
        prev ? { ...prev, averageRating: Math.round(avg * 10) / 10, numReviews: allReviews.length } : prev
      );

      toast({ title: isEditing ? "Review updated!" : "Review submitted!", description: "Thank you for your feedback." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
    // Scroll to form
    document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setRating(0);
    setComment("");
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="container max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="h-96 rounded-xl bg-secondary animate-pulse" />
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 w-20 rounded-lg bg-secondary animate-pulse" />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 rounded bg-secondary animate-pulse" style={{ width: `${80 - i * 10}%` }} />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Product not found</h1>
            <Link href="/products">
              <Button variant="outline">Back to Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const availableStock = selectedVariant ? selectedVariant.stock : product.stock;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Lightbox */}
        {isLightboxOpen && (
          <div 
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in-0 duration-300"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div className="relative w-full max-w-5xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={product.images?.[activeImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            </div>
            <button 
              className="absolute top-6 right-6 text-foreground bg-background/50 hover:bg-[#FF531A] hover:text-white transition-colors rounded-full p-2 cursor-pointer"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              {fromDashboard ? (
                <>
                  <Link href={`/admin?tab=${dashboardTab}`} className="text-muted-foreground hover:text-foreground transition-colors font-semibold truncate hover:text-primary">
                    ← Back to Dashboard
                  </Link>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
                </>
              ) : (
                <>
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">Products</Link>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium capitalize">{product.category}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Product Detail */}
        <section className="py-12">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Images */}
              <div className="space-y-4">
                <div 
                  className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden bg-secondary border border-border cursor-zoom-in group"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <Image
                    src={product.images?.[activeImage] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  {discount && (
                    <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full">
                      -{discount}%
                    </span>
                  )}
                </div>
                {product.images?.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                          activeImage === i
                            ? "border-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Video */}
                {product.video && (
                  <div className="rounded-xl overflow-hidden border border-border">
                    <video controls className="w-full" src={product.video} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="lg:sticky lg:top-24 flex flex-col space-y-6 self-start pb-8">
                <div>
                  <p className="text-sm text-muted-foreground capitalize mb-1 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {product.category}
                  </p>
                  <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>
                </div>

                {/* Rating Summary */}
                <div className="flex items-center gap-3">
                  <StarRating rating={Math.round(product.averageRating)} />
                  {product.numReviews > 0 ? (
                    <span className="text-sm text-muted-foreground">
                      {product.averageRating.toFixed(1)} · {product.numReviews} review{product.numReviews !== 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">No reviews yet</span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-xl line-through text-muted-foreground">${product.originalPrice.toFixed(2)}</span>
                  )}
                  {discount && (
                    <span className="text-sm bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded">
                      Save {discount}%
                    </span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <div className={`relative overflow-hidden transition-all duration-300 ${!isDescExpanded ? 'line-clamp-4' : ''}`}>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{product.description}</p>
                    {!isDescExpanded && (
                      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background to-transparent" />
                    )}
                  </div>
                  <button 
                    onClick={() => setIsDescExpanded(!isDescExpanded)} 
                    className="mt-2 text-[#FF531A] hover:text-[#FF531A]/80 font-medium text-sm transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {isDescExpanded ? "Show less" : "Read more"}
                  </button>
                </div>

                {/* Variants */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-3">
                    <p className="font-medium text-sm">Select Variant</p>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedVariant(v === selectedVariant ? null : v)}
                          disabled={v.stock === 0}
                          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                            selectedVariant === v
                              ? "border-primary bg-primary text-primary-foreground"
                              : v.stock === 0
                              ? "border-border text-muted-foreground opacity-50 cursor-not-allowed"
                              : "border-border hover:border-primary"
                          }`}
                        >
                          {[v.size, v.color].filter(Boolean).join(" / ")}
                          {v.stock === 0 && " (Out of stock)"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock */}
                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  {availableStock > 0 ? (
                    <span className={availableStock <= 5 ? "text-orange-500 font-medium" : "text-muted-foreground"}>
                      {availableStock <= 5 ? `Only ${availableStock} left in stock!` : `${availableStock} in stock`}
                    </span>
                  ) : (
                    <span className="text-red-500 font-medium">Out of stock</span>
                  )}
                </div>

                {/* Quantity + Add to Cart */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 hover:bg-secondary transition-colors text-lg font-medium"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                      disabled={availableStock === 0}
                      className="px-3 py-2 hover:bg-secondary transition-colors text-lg font-medium disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    disabled={availableStock === 0}
                    className="flex-1 gap-2"
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {availableStock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-12 border-t border-border">
          <div className="container max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              Customer Reviews
              {product.numReviews > 0 && (
                <span className="text-base font-normal text-muted-foreground">
                  ({product.numReviews})
                </span>
              )}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Write a Review */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-xl p-6 sticky top-24" id="review-form">
                  <h3 className="font-semibold text-lg mb-4">
                    {editingReview ? "Edit Your Review" : "Write a Review"}
                  </h3>
                  {user ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Your Rating</p>
                        <StarRating rating={rating} interactive onRate={setRating} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Your Comment</p>
                        <Textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your experience with this product..."
                          rows={4}
                          className="resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        {editingReview && (
                          <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                            Cancel
                          </Button>
                        )}
                        <Button onClick={handleSubmitReview} disabled={submitting} className="flex-1">
                          {submitting ? "Saving..." : editingReview ? "Update Review" : "Submit Review"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 space-y-3">
                      <p className="text-sm text-muted-foreground">
                        You must be signed in to leave a review.
                      </p>
                      <Link href="/auth/signin">
                        <Button className="w-full">Sign In to Review</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <Star className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">No reviews yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Be the first to review this product!</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review._id} className="bg-card border border-border rounded-xl p-5 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                            {review.userName?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{review.userName}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric", month: "long", day: "numeric",
                                })}
                              </p>
                              {review.edited && (
                                <span className="text-xs text-muted-foreground italic border border-border rounded px-1.5 py-0.5">
                                  Edited
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} />
                          {user?.email && reviews.find(r => r._id === review._id) && review.userName === user.name && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs"
                              onClick={() => handleEditReview(review)}
                            >
                              Edit
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                    </div>
                  ))
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
