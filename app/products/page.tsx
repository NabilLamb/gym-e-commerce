// app/products/page.tsx (Server Component)
import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Shop Products",
  description: "Browse our complete selection of premium gym equipment, supplements, and athletic wear. Free shipping on orders over $100.",
};

export default function ProductsPage() {
  return <ProductsClient />;
}