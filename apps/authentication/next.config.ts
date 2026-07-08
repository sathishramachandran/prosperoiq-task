import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
  experimental: {
    globalNotFound: true,
  },
  env: {
    AUTH_URL: process.env.AUTH_URL,
    customsiq: process.env.customsiq,
    gstiq: process.env.gstiq,
    invoiceiq: process.env.invoiceiq,
    complianceiq: process.env.complianceiq,             
  },
};

export default nextConfig;
