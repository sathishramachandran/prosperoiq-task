import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "GST IQ Login",
  description:
    "Sign in to GST IQ — the intelligent platform for GST returns, reconciliation and indirect tax compliance.",
  keywords: [
    "GST IQ login",
    "GST IQ sign in",
    "GST return login",
    "GST reconciliation",
    "Indirect tax compliance",
  ],
  alternates: {
    canonical: "/gstiqlogin",
  },
  openGraph: {
    title: "GST IQ Login | Prospero IQ",
    description:
      "Access your GST IQ workspace to manage GST returns, reconciliation and indirect tax compliance.",
    url: "/gstiqlogin",
    type: "website",
    siteName: "Prospero IQ",
  },
  twitter: {
    card: "summary",
    title: "GST IQ Login | Prospero IQ",
    description:
      "Access your GST IQ workspace to manage GST returns, reconciliation and indirect tax compliance.",
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
