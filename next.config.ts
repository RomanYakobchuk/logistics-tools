import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    output: "standalone",
    images: {
        unoptimized: true
    },
    experimental: {

    }
};

export default nextConfig;
