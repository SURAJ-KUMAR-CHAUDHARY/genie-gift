/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // GitHub Pages configuration
  basePath: '',
  trailingSlash: false,
  output: 'export', // Enable static export for GitHub Pages
  images: {
    unoptimized: true, // Disable image optimization for GitHub Pages
  },
  // Handle API routes for static export
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
