import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  devIndicators: {
    position: 'bottom-right',
  },
  async rewrites() {
    const backendUrl =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'https://manthusa-tvs.onrender.com';

    const cleanBackendUrl = backendUrl.replace(/\/$/, '');

    return [
      {
        source: '/api/:path*',
        destination: `${cleanBackendUrl}/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${cleanBackendUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
