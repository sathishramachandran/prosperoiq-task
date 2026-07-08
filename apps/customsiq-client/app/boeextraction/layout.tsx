import MainAuthComponent from "@/src/components/Auth.tsx/AuthMainContainer";
import MainLayout from "@/src/components/MainLayout/MainLayout";
import type { Metadata } from "next";
import React, { ReactNode, Suspense } from "react";

type Props = {};

export const metadata: Metadata = {
  title: "Bill of Entry Extraction",
  description:
    "Upload, parse and validate Bills of Entry at scale. Customs IQ extracts BOE data automatically and reconciles it for downstream reporting.",
  keywords: [
    "Bill of Entry extraction",
    "BOE extraction",
    "BOE parsing",
    "BOE OCR",
    "Customs IQ BOE",
    "ICEGATE BOE",
    "Import documentation",
  ],
  alternates: {
    canonical: "/boeextraction",
  },
  openGraph: {
    title: "Bill of Entry Extraction | Customs IQ",
    description:
      "Automated Bill of Entry extraction and validation for Indian importers.",
    url: "/boeextraction",
    type: "website",
    siteName: "Customs IQ",
  },
  twitter: {
    card: "summary",
    title: "Bill of Entry Extraction | Customs IQ",
    description:
      "Automated Bill of Entry extraction and validation for Indian importers.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const layout = ({ children }: { children: ReactNode }) => {

  return (
    <div>
      <MainAuthComponent>
        <MainLayout title="Bill of Entry">{children}</MainLayout>
      </MainAuthComponent>
    </div>
  );
};

export default layout;
