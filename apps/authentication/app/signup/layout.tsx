import type { Metadata } from "next";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create your Prospero IQ account to access Customs IQ, GST IQ, Invoice IQ and Compliance IQ in a single unified workspace.",
  keywords: [
    "Prospero IQ signup",
    "Prospero IQ register",
    "Customs IQ signup",
    "GST IQ signup",
    "Create account Prospero IQ",
  ],
  alternates: {
    canonical: "/signup",
  },
  openGraph: {
    title: "Sign Up | Prospero IQ",
    description:
      "Create your Prospero IQ account to access Customs, GST, Invoice and Compliance intelligence in one place.",
    url: "/signup",
    type: "website",
    siteName: "Prospero IQ",
  },
  twitter: {
    card: "summary",
    title: "Sign Up | Prospero IQ",
    description:
      "Create your Prospero IQ account to access the full IQ platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const layout = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default layout;
