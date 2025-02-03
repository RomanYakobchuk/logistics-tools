import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    env: {
        NEXT_PUBLIC_DRIVE_DISTANCE_API: process.env.NEXT_PUBLIC_DRIVE_DISTANCE_API,
        NEXT_PUBLIC_GEOCODE_API: process.env.NEXT_PUBLIC_GEOCODE_API,

    }
};

export default nextConfig;
