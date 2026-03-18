import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Enable for production deployment to Firebase Hosting
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
