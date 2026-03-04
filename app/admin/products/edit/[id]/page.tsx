import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { connectDB } from "@/lib/mongodb"
import Product from "@/models/Product";

// Next.js 15: params is a Promise, must be awaited
export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();
  const product = await Product.findById(id).lean();

  if (!product) notFound();

  // Convert MongoDB _id and dates to plain strings for the client component
  const plainProduct = JSON.parse(JSON.stringify(product));

  return <ProductForm initialData={plainProduct} />;
}
