import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your Prospero IQ dashboard — a single launchpad for Customs IQ, GST IQ, Invoice IQ and Compliance IQ.",
  keywords: [
    "Prospero IQ dashboard",
    "IQ workspace",
    "Compliance dashboard",
    "Customs dashboard",
    "GST dashboard",
  ],
  alternates: {
    canonical: "/dashboard",
  },
  openGraph: {
    title: "Dashboard | Prospero IQ",
    description:
      "Your Prospero IQ dashboard — a single launchpad for all IQ products.",
    url: "/dashboard",
    type: "website",
    siteName: "Prospero IQ",
  },
  twitter: {
    card: "summary",
    title: "Dashboard | Prospero IQ",
    description:
      "Your Prospero IQ dashboard — a single launchpad for all IQ products.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const layout = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export default layout;
