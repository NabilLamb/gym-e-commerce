// app/auth/page.tsx (Server Component)
import type { Metadata } from "next";
import AuthClient from "./AuthClient";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your FitHub account to track orders and manage bookings.",
};

export default function AuthPage() {
  return <AuthClient />;
}