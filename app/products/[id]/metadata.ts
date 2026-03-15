import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function generateProductMetadata(id: string): Promise<Metadata> {
  try {
    await connectDB();
    const product = await Product.findById(id).lean() as any;
    if (!product) return { title: "Product Not Found" };

    return {
      title: product.name,
      description: product.description?.slice(0, 160),
      openGraph: {
        title: `${product.name} | FitHub`,
        description: product.description?.slice(0, 160),
        images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      },
    };
  } catch {
    return { title: "Product" };
  }
}