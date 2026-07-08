import MainAuthComponent from "@/src/components/Auth.tsx/AuthMainContainer";
import MainLayout from "@/src/components/MainLayout/MainLayout";
import type { Metadata } from "next";
import React, { ReactNode, Suspense } from "react";

type Props = {};

export const metadata: Metadata = {
  title: "Shipping Bill Reports",
  description:
    "Shipping Bill reports — drawback, incentives, port-wise and exporter-wise analytics — generated automatically by Customs IQ.",
  keywords: [
    "Shipping Bill reports",
    "SB reports",
    "Drawback report",
    "Export incentive report",
    "Customs IQ SB reports",
  ],
  alternates: {
    canonical: "/reports/sb-reports",
  },
  openGraph: {
    title: "Shipping Bill Reports | Customs IQ",
    description:
      "Shipping Bill reports — drawback, incentives and exporter-wise analytics.",
    url: "/reports/sb-reports",
    type: "website",
    siteName: "Customs IQ",
  },
  twitter: {
    card: "summary",
    title: "Shipping Bill Reports | Customs IQ",
    description:
      "Shipping Bill reports — drawback, incentives and exporter-wise analytics.",
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
