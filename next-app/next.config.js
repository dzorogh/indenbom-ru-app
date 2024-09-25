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
    ],
  },
};

module.exports = nextConfig;
