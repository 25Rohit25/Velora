import type { Metadata, Viewport } from "next";
import { Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

import { Indie_Flower } from "next/font/google";
const indie = Indie_Flower({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-handwriting",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FFF8F6",
  initialScale: 1,
  maximumScale: 1,
  width: "device-width",
  userScalable: false,
}

export const metadata: Metadata = {
  title: "Velora | Relationship Sanctuary",
  description: "A private, emotionally intelligent relationship app for couples.",
};

import AuthProvider from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${playfair.variable} ${indie.variable} font-sans antialiased bg-cream text-slate-800 overflow-x-hidden selection:bg-rose-200 selection:text-slate-900`}>
        <div className="animated-bg">
          <div className="blob-1"></div>
          <div className="blob-2"></div>
          <div className="blob-3"></div>
        </div>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
