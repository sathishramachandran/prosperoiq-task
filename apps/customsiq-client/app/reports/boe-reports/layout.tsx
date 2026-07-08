import MainAuthComponent from "@/src/components/Auth.tsx/AuthMainContainer";
import MainLayout from "@/src/components/MainLayout/MainLayout";
import type { Metadata } from "next";
import React, { ReactNode, Suspense } from "react";

type Props = {};

export const metadata: Metadata = {
  title: "BOE Reports",
  description:
    "Bill of Entry reports — duty paid, bond/BG utilisation, invoice-level breakdowns and more — generated automatically by Customs IQ.",
  keywords: [
    "BOE reports",
    "Bill of Entry reports",
    "BOE duty report",
    "BOE invoice report",
    "Bond BG report",
    "Customs IQ BOE reports",
  ],
  alternates: {
    canonical: "/reports/boe-reports",
  },
  openGraph: {
    title: "BOE Reports | Customs IQ",
    description:
      "Bill of Entry reports — duty, bond/BG and invoice-level analytics.",
    url: "/reports/boe-reports",
    type: "website",
    siteName: "Customs IQ",
  },
  twitter: {
    card: "summary",
    title: "BOE Reports | Customs IQ",
    description:
      "Bill of Entry reports — duty, bond/BG and invoice-level analytics.",
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
