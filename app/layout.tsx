import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { CartProvider } from '@/components/cart-provider'
import { ResizeObserverErrorGuard } from '@/components/resize-observer-error-guard'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'

// Fonts are self-hosted from npm packages, so the site never calls Google Fonts.
const archivoBlack = localFont({
  src: '../node_modules/@fontsource/archivo-black/files/archivo-black-latin-400-normal.woff2',
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

const bricolage = localFont({
  src: '../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2',
  weight: '200 800',
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Yard Heat | Small-Batch Jamaican Pepper Sauces',
  description:
    'Small-batch Jamaican pepper sauces and spice rubs, bottled hot and ready to fire up your table.',
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_JM',
    description: SITE_DESCRIPTION,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Yard Heat: small-batch Jamaican pepper sauces and spice rubs' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.jpg'] },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fbf1e2',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${archivoBlack.variable} ${bricolage.variable}`}>
      <body className="antialiased">
        <CartProvider>
          <a href="#main" className="skip-link">Skip to content</a>
          {children}
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
