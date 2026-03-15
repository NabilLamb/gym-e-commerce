// app/admin/services/edit/[id]/page.tsx

import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();
  const service = await Service.findById(id).lean();

  if (!service) notFound();

  const plainService = JSON.parse(JSON.stringify(service));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12">
        <ServiceForm initialData={plainService} />
      </main>
      <Footer />
    </>
  );
}
