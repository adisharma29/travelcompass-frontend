import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev",
        pathname: "/images/**",
      },
    ],
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;
