import type { NextConfig } from "next";
import path from 'path'
// next.config.js ou next.config.mjs (si tu utilises le format ESM)
const nextConfig = {
  turbo: {
    enabled: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'images.unsplash.com'],
  },
  experimental: {
    serverActions: true,
    typedRoutes: true,
  },
};

export default nextConfig;
