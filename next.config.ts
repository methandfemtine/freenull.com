import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    runtime: "nodejs",
  },
  // Cloudflare Pages configuration
  outputFileTracingIncludes: {
    '/api/**/*': ['./lib/**/*'],
  },
};

export default nextConfig;
