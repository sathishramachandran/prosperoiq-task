import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Customs IQ Login",
  description:
    "Sign in to Customs IQ — the intelligent platform for Bill of Entry, Shipping Bill and Customs compliance automation.",
  keywords: [
    "Customs IQ login",
    "Customs IQ sign in",
    "Bill of Entry login",
    "Shipping Bill login",
    "Customs compliance login",
  ],
  alternates: {
    canonical: "/customsiqlogin",
  },
  openGraph: {
    title: "Customs IQ Login | Prospero IQ",
    description:
      "Access your Customs IQ workspace to manage BOE, SB extraction and customs reports.",
    url: "/customsiqlogin",
    type: "website",
    siteName: "Prospero IQ",
  },
  twitter: {
    card: "summary",
    title: "Customs IQ Login | Prospero IQ",
    description:
      "Access your Customs IQ workspace to manage BOE, SB extraction and customs reports.",
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
