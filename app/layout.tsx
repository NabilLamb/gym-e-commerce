import React from "react";
import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/toaster";

const fontHeading = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
});

const fontBody = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "FitHub — Premium Gym Equipment & Fitness Services",
    template: "%s | FitHub",
  },
  description:
    "Shop premium gym equipment, supplements, and athletic wear. Book expert personal training and fitness services. Transform your body with FitHub.",
  keywords: [
    "gym equipment",
    "fitness",
    "personal training",
    "supplements",
    "athletic wear",
    "workout gear",
    "gym booking",
    "fitness services",
  ],
  authors: [{ name: "FitHub" }],
  creator: "FitHub",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "FitHub",
    title: "FitHub — Premium Gym Equipment & Fitness Services",
    description:
      "Shop premium gym equipment, supplements, and athletic wear. Book expert personal training and fitness services.",
    images: [
      {
        url: "/hero-image.png",
        width: 1200,
        height: 630,
        alt: "FitHub — Premium Gym Equipment & Fitness Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FitHub — Premium Gym Equipment & Fitness Services",
    description:
      "Shop premium gym equipment, supplements, and athletic wear. Book expert personal training and fitness services.",
    images: ["/hero-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontBody.variable} ${fontHeading.variable} font-sans antialiased selection:bg-primary/30 min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}