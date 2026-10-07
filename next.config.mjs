/** @type {import('next').NextConfig} */
const nextConfig = {
  // Development only: lets a phone on the local network load the dev server's scripts.
  allowedDevOrigins: ['192.168.0.16'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
