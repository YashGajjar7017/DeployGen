/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
      {
        protocol: 'https',
        hostname: 'code.visualstudio.com',
      },
      {
        protocol: 'https',
        hostname: 'nodejs.org',
      },
      {
        protocol: 'https',
        hostname: 'git-scm.com',
      },
      {
        protocol: 'https',
        hostname: 'www.python.org',
      },
      {
        protocol: 'https',
        hostname: 'www.docker.com',
      },
      {
        protocol: 'https',
        hostname: 'www.postman.com',
      },
      {
        protocol: 'https',
        hostname: 'www.mongodb.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  },
};

export default nextConfig;
