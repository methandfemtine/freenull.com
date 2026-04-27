import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages configuration
  outputFileTracingIncludes: {
    '/api/**/*': ['./lib/**/*'],
  },
};

export default nextConfig;
