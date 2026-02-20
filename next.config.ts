import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      // CSP for guest-facing hotel routes
      source: "/h/:path*",
      headers: [
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            `img-src 'self' data: blob: ${apiUrl} https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev https://*.cdninstagram.com https://*.fbcdn.net`,
            `connect-src 'self' ${apiUrl}`,
            "media-src 'self'",
            "manifest-src 'self'",
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
        hostname: "i0.wp.com",
        pathname: "/refuje.com/**",
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

if (process.env.ENABLE_OPENNEXT_CF_DEV === "1") {
  try {
    // Keep Cloudflare dev integration optional for local runs.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
    initOpenNextCloudflareForDev();
  } catch {
    // Dependency may be absent in local environments.
  }
}

export default nextConfig;
