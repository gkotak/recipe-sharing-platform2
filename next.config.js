/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Force the app to use a specific port
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'localhost:3000',
            },
          ],
          destination: 'http://localhost:3004/:path*',
        },
      ],
    }
  },
}

module.exports = nextConfig