/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.indenbom.ru',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'live.staticflickr.com',
        port: '',
        pathname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/person/:slug',
        destination: '/people/:slug',
        permanent: true,
      },
    ]
  },
};

module.exports = nextConfig;
