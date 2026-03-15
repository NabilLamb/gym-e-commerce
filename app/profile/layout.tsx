// app/profile/layout.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your profile, orders, and bookings.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}