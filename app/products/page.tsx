"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryCategory = searchParams.get("category");
  const queryPage = searchParams.get("page");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const initialCategory = queryCategory && ["all", "equipment", "supplements", "clothes"].includes(queryCategory.toLowerCase()) 
      ? (queryCategory.toLowerCase() as Category) 
      : "all";

  const initialPage = queryPage ? parseInt(queryPage, 10) : 1;

  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
  const [currentPage, setCurrentPage] = useState<number>(initialPage > 0 ? initialPage : 1);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  useEffect(() => {
    if (queryCategory && ["all", "equipment", "supplements", "clothes"].includes(queryCategory.toLowerCase())) {
      setSelectedCategory(queryCategory.toLowerCase() as Category);
    } else if (!queryCategory) {
      setSelectedCategory("all");
    }
  }, [queryCategory]);

  useEffect(() => {
    const pageObj = parseInt(queryPage || "1", 10);
    setCurrentPage(pageObj > 0 ? pageObj : 1);
  }, [queryPage]);

  const handleCategoryChange = (cat: Category) => {
    setSelectedCategory(cat);
    if (cat === "all") {
      router.replace("/products", { scroll: false });
    } else {
      router.replace(`/products?category=${cat}`, { scroll: false });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`/products?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const pageSize = 12;
  const totalPages = Math.ceil(filteredAndSortedProducts.length / pageSize);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background relative pb-24">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-primary/5 via-background to-background -z-10" />

        {/* Breadcrumb */}
        <div className="border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-40">
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">Products</span>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <section className="py-16 md:py-24 border-b border-border/50 relative overflow-hidden">
          <div className="absolute top-1/2 right-[10%] w-[30%] h-full rounded-full bg-primary/10 blur-[100px] -z-10" />
          <div className="container max-w-7xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">Our <span className="text-primary">Products</span></h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium">
              Browse our complete selection of premium gym equipment, supplements, and athletic wear.
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <div className="lg:w-72 flex-shrink-0">
                <div className="athletic-card p-6 sticky top-24">
                  <h3 className="font-bold text-xl mb-6 tracking-tight">Filters</h3>

                  {/* Category Filter */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wider">Category</h4>
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
                          onClick={() => handleCategoryChange(cat)}
                          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                            selectedCategory === cat
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 translate-x-1"
                              : "hover:bg-secondary text-foreground hover:translate-x-1"
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
                <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Showing {paginatedProducts.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-
                    {Math.min(currentPage * pageSize, filteredAndSortedProducts.length)} of{" "}
                    {filteredAndSortedProducts.length} products
                  </span>
                </div>
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="border border-border/50 rounded-xl h-[420px] animate-pulse bg-card/50 backdrop-blur-sm shadow-sm"
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <ProductGrid products={paginatedProducts} />
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-12">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 rounded-lg font-medium border border-border/50 bg-card hover:bg-[#FF531A] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Previous
                        </button>
                        <div className="flex items-center gap-1 mx-2">
                          {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => handlePageChange(i + 1)}
                              className={`w-10 h-10 rounded-lg font-medium flex items-center justify-center transition-colors cursor-pointer ${
                                currentPage === i + 1
                                  ? "bg-[#FF531A] text-white border-transparent"
                                  : "border border-border/50 bg-card hover:bg-[#FF531A] hover:text-white"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 rounded-lg font-medium border border-border/50 bg-card hover:bg-[#FF531A] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
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

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
