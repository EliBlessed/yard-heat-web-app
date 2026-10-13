/** Sent with every response: no framing by other sites, no MIME sniffing, a tight referrer and no device APIs. */
const securityHeaders = [
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Development only: lets a phone on the local network load the dev server's scripts.
  allowedDevOrigins: ['192.168.0.16'],
  images: {
    // Photos are pre-compressed to WebP in /public, so they are served as-is.
    unoptimized: true,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
