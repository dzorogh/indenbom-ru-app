/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
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
};

module.exports = nextConfig;
