// app/services/layout.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fitness Services",
  description:
    "Book expert personal training, group classes, and fitness assessments.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}