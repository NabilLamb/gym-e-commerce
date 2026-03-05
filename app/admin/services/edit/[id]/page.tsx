// app/admin/services/edit/[id]/page.tsx

import { notFound } from "next/navigation";
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

  return <ServiceForm initialData={plainService} />;
}
