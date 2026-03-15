// app/services/[id]/page.tsx

import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { ServiceDetailClient } from "./ServiceDetailClient";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  try {
    const { id } = await params;
    await connectDB();
    const service = await Service.findById(id).lean() as any;

    if (!service) return { title: "Service Not Found" };

    return {
      title: service.name,
      description: service.description?.slice(0, 160),
      openGraph: {
        title: `${service.name} | FitHub`,
        description: service.description?.slice(0, 160),
        images: service.image ? [{ url: service.image }] : [],
      },
    };
  } catch {
    return { title: "Service" };
  }
}

export default async function ServiceDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return <ServiceDetailClient id={id} />;
}