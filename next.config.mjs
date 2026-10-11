/** @type {import('next').NextConfig} */
const nextConfig = {
  // Development only: lets a phone on the local network load the dev server's scripts.
  allowedDevOrigins: ['192.168.0.16'],
  images: {
    // Photos are pre-compressed to WebP in /public, so they are served as-is.
    unoptimized: true,
  },
}

export default nextConfig
