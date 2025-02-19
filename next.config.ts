import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    launchDarklyClientId: process.env.LAUNCH_DARKLY_CLIENT_ID,
  },
};

export default nextConfig;
