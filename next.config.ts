import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      // CSP report-only for guest-facing hotel routes
      source: "/h/:path*",
      headers: [
        {
          key: "Content-Security-Policy-Report-Only",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: http://localhost:8000 https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev https://*.cdninstagram.com https://*.fbcdn.net",
            "connect-src 'self' http://localhost:8000 https://api.refuje.com",
            "frame-src 'none'",
            "object-src 'none'",
            "base-uri 'self'",
          ].join("; "),
        },
      ],
    },
  ],
  images: {
    unoptimized: true,
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
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
        pathname: "/**",
      },
    ],
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;
