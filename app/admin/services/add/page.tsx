// app/admin/services/add/page.tsx

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ServiceForm } from "@/components/admin/ServiceForm";

export default function AddServicePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12">
        <ServiceForm />
      </main>
      <Footer />
    </>
  );
}