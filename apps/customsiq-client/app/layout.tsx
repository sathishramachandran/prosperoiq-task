import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/src/provider/ReactQueryProvider";
import { Toaster } from "react-hot-toast";
import MainAuthComponent from "@/src/components/Auth.tsx/AuthMainContainer";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"], // Specify the necessary font subsets
  display: "swap", // Ensures the text is always visible while the font is loading
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.CUSTOMS_URL || "https://customsiq.prosperoiq.com"),
  title: {
    default: "Customs IQ | Bill of Entry & Shipping Bill Automation",
    template: "%s | Customs IQ",
  },
  description:
    "Customs IQ automates Bill of Entry and Shipping Bill extraction, customs reporting and EXIM compliance for Indian importers and exporters.",
  keywords: [
    "Customs IQ",
    "Bill of Entry extraction",
    "BOE extraction",
    "Shipping Bill extraction",
    "SB extraction",
    "Customs automation",
    "EXIM compliance",
    "Customs reports",
    "Bond BG report",
    "Invoice report",
    "Master report",
    "Indian customs",
    "ICEGATE",
    "Trade compliance",
  ],
  applicationName: "Customs IQ",
  authors: [{ name: "Prospero IQ" }],
  creator: "Prospero IQ",
  publisher: "Prospero IQ",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Customs IQ",
    title: "Customs IQ | Bill of Entry & Shipping Bill Automation",
    description:
      "Automate BOE and SB extraction, generate customs reports and stay EXIM compliant with Customs IQ.",
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Customs IQ | Bill of Entry & Shipping Bill Automation",
    description:
      "Automate BOE and SB extraction, generate customs reports and stay EXIM compliant with Customs IQ.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-right" />
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
