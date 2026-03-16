/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "@prisma/adapter-neon"],
  },
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/studio",
        permanent: true,
      },
      {
        source: "/home/:path*",
        destination: "/studio/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
