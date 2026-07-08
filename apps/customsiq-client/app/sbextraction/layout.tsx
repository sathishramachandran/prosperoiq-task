import type { Metadata } from "next";
import MainAuthComponent from '@/src/components/Auth.tsx/AuthMainContainer'
import MainLayout from '@/src/components/MainLayout/MainLayout'
import React, { ReactNode, Suspense } from 'react'

type Props = {}

export const metadata: Metadata = {
  title: "Shipping Bill Extraction",
  description:
    "Upload, parse and validate Shipping Bills at scale. Customs IQ automates SB extraction and reconciliation for exporters.",
  keywords: [
    "Shipping Bill extraction",
    "SB extraction",
    "Shipping Bill OCR",
    "Customs IQ SB",
    "Export documentation",
    "ICEGATE shipping bill",
  ],
  alternates: {
    canonical: "/sbextraction",
  },
  openGraph: {
    title: "Shipping Bill Extraction | Customs IQ",
    description:
      "Automated Shipping Bill extraction and validation for Indian exporters.",
    url: "/sbextraction",
    type: "website",
    siteName: "Customs IQ",
  },
  twitter: {
    card: "summary",
    title: "Shipping Bill Extraction | Customs IQ",
    description:
      "Automated Shipping Bill extraction and validation for Indian exporters.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <MainAuthComponent>
      <MainLayout title="Shipping Bill">
        {children}
      </MainLayout>
    </MainAuthComponent>

  )
}

export default layout