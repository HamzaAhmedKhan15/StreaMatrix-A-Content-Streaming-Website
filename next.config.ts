import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Artwork is inlined as local SVG data URIs (see lib/artwork.ts), so there
    // is nothing for the optimizer to fetch/resize. `next/image` is still used
    // for lazy-loading and layout stability.
    unoptimized: true,
  },
  // Hide the on-screen Next.js dev indicator badge (bottom-left in dev).
  devIndicators: false,
};

export default nextConfig;
