import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Enables `use cache`, `cacheTag`, `cacheLife`, and `updateTag` APIs.
  // Also enables React Activity-based route preservation during navigation.
  cacheComponents: true,
  // Silence the turbopack/webpack mismatch warning introduced in Next 16.
  // @ducanh2912/next-pwa adds a webpack config; we explicitly opt into webpack
  // for production builds by leaving turbopack unconfigured here.
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
  allowedDevOrigins: ["192.168.1.2"],
};

export default withPWA(nextConfig);
