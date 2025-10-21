import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [],
    unoptimized: true, // This allows data URLs to work
  },
};

export default nextConfig;
