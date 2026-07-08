import MainAuthComponent from "@/src/components/Auth.tsx/AuthMainContainer";
import type { Metadata } from "next";
import React, { ReactNode, Suspense } from "react";
import ReportsLayoutShell from "./_components/ReportsLayoutShell";

type Props = {};

export const metadata: Metadata = {
  title: "Reports",
  description:
    "Generate, filter and download customs reports — BOE reports, Shipping Bill reports and master data reports — from a single Customs IQ workspace.",
  keywords: [
    "Customs IQ reports",
    "Customs reports",
    "BOE reports",
    "Shipping Bill reports",
    "Master reports",
    "EXIM reporting",
    "Customs analytics",
  ],
  alternates: {
    canonical: "/reports",
  },
  openGraph: {
    title: "Reports | Customs IQ",
    description:
      "All your customs reports — BOE, SB and master data — in one Customs IQ workspace.",
    url: "/reports",
    type: "website",
    siteName: "Customs IQ",
  },
  twitter: {
    card: "summary",
    title: "Reports | Customs IQ",
    description:
      "All your customs reports — BOE, SB and master data — in one place.",
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
        <Suspense fallback  ={null}>
          <ReportsLayoutShell>{children}</ReportsLayoutShell>
        </Suspense>
      </MainAuthComponent>
    </div>
  );
};

export default layout;
