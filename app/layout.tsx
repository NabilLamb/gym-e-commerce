import React from "react";
import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
// Import the AuthProvider from the context folder you created
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

const fontHeading = Barlow_Condensed({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-heading"
});

const fontBody = DM_Sans({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "FitHub - Gym Equipment & Services",
  description: "Premium gym equipment, supplements, and fitness services",
  icons: {
    icon: "/favicon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontBody.variable} ${fontHeading.variable} font-sans antialiased selection:bg-primary/30 min-h-screen flex flex-col`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {/* Wrap children with AuthProvider */}
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
