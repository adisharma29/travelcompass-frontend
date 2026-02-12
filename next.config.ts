import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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

export default nextConfig;
