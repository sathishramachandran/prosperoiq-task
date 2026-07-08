import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "@/provider/ReactQueryProvider";
import ReactCookiesProvider from "@/provider/CookiesProvider";

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap", // Ensures the fallback font is used while Manrope loads
  variable: "--font-manrope", // Optional: for use with Tailwind CSS
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.AUTH_URL || "https://prosperoiq.com"),
  title: {
    default: "Prospero IQ | Intelligent Business Compliance Suite",
    template: "%s | Prospero IQ",
  },
  description:
    "Prospero IQ is a unified intelligence platform for Customs, GST, Invoice, and Compliance management. Sign in or sign up to access your IQ workspace.",
  keywords: [
    "Prospero IQ",
    "Customs IQ",
    "GST IQ",
    "Invoice IQ",
    "Compliance IQ",
    "EXIM compliance",
    "Customs automation",
    "GST automation",
    "Business intelligence",
    "Trade compliance",
  ],
  applicationName: "Prospero IQ",
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
    siteName: "Prospero IQ",
    title: "Prospero IQ | Intelligent Business Compliance Suite",
    description:
      "Unified authentication for the Prospero IQ platform — Customs IQ, GST IQ, Invoice IQ and Compliance IQ.",
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prospero IQ | Intelligent Business Compliance Suite",
    description:
      "Sign in to the Prospero IQ platform — your unified workspace for Customs, GST, Invoice and Compliance intelligence.",
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
      <body className={`${manrope.className} `}>
        <Toaster position="top-right" />
        <ReactCookiesProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ReactCookiesProvider>
      </body>
    </html>
  );
}
