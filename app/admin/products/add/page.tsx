//app\admin\products\add\page.tsx

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductForm } from "@/components/admin/ProductForm";

export default function AddProductPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12">
        <ProductForm />
      </main>
      <Footer />
    </>
  );
}