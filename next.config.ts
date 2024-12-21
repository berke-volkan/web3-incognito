import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        port: '',
        pathname: '',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'placeholder.com',
        port: '',
        pathname: '',
        search: '',
      },
    ],
  }}

export default nextConfig;
