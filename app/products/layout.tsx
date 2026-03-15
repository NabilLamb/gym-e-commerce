// app/products/layout.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Products",
  description:
    "Browse our complete selection of premium gym equipment, supplements, and athletic wear.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}