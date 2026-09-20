/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {},
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ignored: [
        '**/java-backend*/**',
        '**/ml-service/**',
        '**/target/**',
        '**/logs/**',
        '**/.git/**',
        '**/node_modules/**',
      ],
    };
    return config;
  },
}

export default nextConfig


