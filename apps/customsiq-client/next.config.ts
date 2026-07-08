import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
   transpilePackages: ["prosperoiq-table"],
  experimental: {
    globalNotFound: true,
  },
  env: {
    AUTH_URL: process.env.AUTH_URL,
    CUSTOMS_URL: process.env.CUSTOMS_URL,
    CLIENT_AUTH_URL: process.env.CLIENT_AUTH_URL,
  },
};

export default nextConfig;
