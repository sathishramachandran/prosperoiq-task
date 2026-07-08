import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Verify Email",
  description:
    "Verify your email address to activate your Prospero IQ account and unlock access to the IQ platform.",
  keywords: [
    "Prospero IQ verify email",
    "Email verification",
    "Activate account",
    "Prospero IQ confirm email",
  ],
  alternates: {
    canonical: "/verify-email",
  },
  openGraph: {
    title: "Verify Email | Prospero IQ",
    description:
      "Confirm your email address to finish setting up your Prospero IQ account.",
    url: "/verify-email",
    type: "website",
    siteName: "Prospero IQ",
  },
  twitter: {
    card: "summary",
    title: "Verify Email | Prospero IQ",
    description:
      "Confirm your email address to finish setting up your Prospero IQ account.",
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
