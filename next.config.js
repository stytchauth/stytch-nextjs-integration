/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Force IPv4 localhost
    serverComponentsExternalPackages: [],
  },
  // Force IPv4 for development
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
