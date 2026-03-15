import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactClient } from "./ContactClient"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with FitHub. We're here to help with any questions about our products, services, or bookings.",
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <ContactClient />
      <Footer />
    </>
  )
}