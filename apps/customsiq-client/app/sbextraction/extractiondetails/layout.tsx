import MainAuthComponent from "@/src/components/Auth.tsx/AuthMainContainer";
import MainLayout from "@/src/components/MainLayout/MainLayout";
import type { Metadata } from "next";
import React, { ReactNode, Suspense } from "react";

type Props = {};

export const metadata: Metadata = {
  title: "Shipping Bill Extraction Details",
  description:
    "Drill into a single Shipping Bill — review extracted line items, drawback, incentives and validation results inside Customs IQ.",
  keywords: [
    "Shipping Bill extraction details",
    "SB extraction details",
    "Shipping Bill line items",
    "SB drawback",
    "Customs IQ SB detail",
  ],
  alternates: {
    canonical: "/sbextraction/extractiondetails",
  },
  openGraph: {
    title: "Shipping Bill Extraction Details | Customs IQ",
    description:
      "Inspect extracted Shipping Bill data, line items and drawback calculations.",
    url: "/sbextraction/extractiondetails",
    type: "website",
    siteName: "Customs IQ",
  },
  twitter: {
    card: "summary",
    title: "Shipping Bill Extraction Details | Customs IQ",
    description:
      "Inspect extracted Shipping Bill data, line items and drawback calculations.",
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