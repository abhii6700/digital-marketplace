/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'digital-marketplace-production-87e8.up.railway.app/',
      },
    ],
  },
};

module.exports = nextConfig;
