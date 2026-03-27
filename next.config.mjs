/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Vercel deployment configuration (recommended for Next.js with API routes)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/aida-public/**',
      },
    ],
  },
  // Enable experimental features for better deployment
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
