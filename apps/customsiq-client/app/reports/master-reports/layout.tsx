import MainAuthComponent from "@/src/components/Auth.tsx/AuthMainContainer";
import MainLayout from "@/src/components/MainLayout/MainLayout";
import type { Metadata } from "next";
import React, { ReactNode, Suspense } from "react";

type Props = {};

export const metadata: Metadata = {
  title: "Master Reports",
  description:
    "Consolidated master data reports across BOE, Shipping Bill and reference data — exportable from Customs IQ.",
  keywords: [
    "Master reports",
    "Customs master data",
    "Reference data report",
    "Customs IQ master reports",
    "EXIM master report",
  ],
  alternates: {
    canonical: "/reports/master-reports",
  },
  openGraph: {
    title: "Master Reports | Customs IQ",
    description:
      "Consolidated master data reports across BOE, SB and reference data.",
    url: "/reports/master-reports",
    type: "website",
    siteName: "Customs IQ",
  },
  twitter: {
    card: "summary",
    title: "Master Reports | Customs IQ",
    description:
      "Consolidated master data reports across BOE, SB and reference data.",
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
