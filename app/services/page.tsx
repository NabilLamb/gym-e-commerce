// app/services/page.tsx (Server Component)
import type { Metadata } from "next";
import ServicesClient from "./ServicesClient"; 

export const metadata: Metadata = {
  title: "Fitness Services",
  description: "Book expert personal training, group classes, and fitness assessments. Professional coaches ready to help you reach your goals.",
};

export default function ServicesPage() {
  return <ServicesClient />;
}