import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* PWA Configuration */
  reactStrictMode: true,
  
  /* Image optimization */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  /* Performance optimizations */
  compress: true,
  
  /* Generate new build IDs to bust cache */
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  
  /* Headers for PWA + cache behaviour*/
  async headers() {
    return [
      // 1️⃣ HTML: always fetch fresh (prevents stale/corrupted shells)
      {
        source: "/:path*",
        has: [
          {
            type: "header",
            key: "accept",
            value: "text/html",
          },
        ],
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },

      // 2️⃣ Next.js static assets: cache forever (filenames are hashed per build)
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // 3️⃣ Public images: also safe to cache long-term
      {
        source: "/:path*.:ext(svg|png|jpg|jpeg|gif|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },

      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
          // optional: avoid SW itself being weirdly cached
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
