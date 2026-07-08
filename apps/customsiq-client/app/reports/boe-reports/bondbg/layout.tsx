import MainAuthComponent from "@/src/components/Auth.tsx/AuthMainContainer";
import MainLayout from "@/src/components/MainLayout/MainLayout";
import type { Metadata } from "next";
import React, { ReactNode, Suspense } from "react";

type Props = {};

export const metadata: Metadata = {
  title: "BOE Bond / BG Report",
  description:
    "Track Bond and Bank Guarantee utilisation against your Bills of Entry — automatically reconciled by Customs IQ.",
  keywords: [
    "Bond BG report",
    "Bank Guarantee report",
    "BOE bond utilisation",
    "Customs bond tracking",
    "Customs IQ bond report",
  ],
  alternates: {
    canonical: "/reports/boe-reports/bondbg",
  },
  openGraph: {
    title: "BOE Bond / BG Report | Customs IQ",
    description:
      "Bond and Bank Guarantee utilisation report against your Bills of Entry.",
    url: "/reports/boe-reports/bondbg",
    type: "website",
    siteName: "Customs IQ",
  },
  twitter: {
    card: "summary",
    title: "BOE Bond / BG Report | Customs IQ",
    description:
      "Bond and Bank Guarantee utilisation report against your Bills of Entry.",
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
