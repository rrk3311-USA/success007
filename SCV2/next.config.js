/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "successchemistry.com", pathname: "/**" },
    ],
  },
};

module.exports = nextConfig;
