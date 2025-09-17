import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // Temporary: disable for debugging WebSocket issue
  allowedDevOrigins: ['http://175.196.226.236:3000'], // Allow cross-origin requests in dev
};

export default nextConfig;
