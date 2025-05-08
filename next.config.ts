import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    env: {
        NEXT_PUBLIC_DRIVE_DISTANCE_API: process.env.NEXT_PUBLIC_DRIVE_DISTANCE_API,
        NEXT_PUBLIC_GEOCODE_API: process.env.NEXT_PUBLIC_GEOCODE_API,
        API_BASE_URL: process.env.API_BASE_URL || 'https://api.krewsapp.com/test',
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'media.krewsapp.com',
                pathname: '**',
            },
        ],
    },
};

export default nextConfig;
