/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    // Local build only – product images served from /images/products/ in this app
  },
};

module.exports = nextConfig;
