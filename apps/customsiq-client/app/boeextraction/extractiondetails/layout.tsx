import MainAuthComponent from "@/src/components/Auth.tsx/AuthMainContainer";
import MainLayout from "@/src/components/MainLayout/MainLayout";
import type { Metadata } from "next";
import React, { ReactNode, Suspense } from "react";

type Props = {};

export const metadata: Metadata = {
  title: "BOE Extraction Details",
  description:
    "Drill into a single Bill of Entry — review extracted line items, duties, charges and validation results inside Customs IQ.",
  keywords: [
    "BOE extraction details",
    "Bill of Entry details",
    "BOE line items",
    "BOE duties",
    "Customs IQ BOE detail",
  ],
  alternates: {
    canonical: "/boeextraction/extractiondetails",
  },
  openGraph: {
    title: "BOE Extraction Details | Customs IQ",
    description:
      "Inspect extracted Bill of Entry data, line items and duty calculations.",
    url: "/boeextraction/extractiondetails",
    type: "website",
    siteName: "Customs IQ",
  },
  twitter: {
    card: "summary",
    title: "BOE Extraction Details | Customs IQ",
    description:
      "Inspect extracted Bill of Entry data, line items and duty calculations.",
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