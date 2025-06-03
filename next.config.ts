import type { NextConfig } from "next";
console.log("✅ BUILD CHECK: next.config.js ran")
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
