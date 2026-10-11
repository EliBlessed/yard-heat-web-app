import Link from "next/link"
import { CartLink } from "@/components/cart-link"

export function FlameMark({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} aria-hidden="true">
      <path d="M51 37.5
               c.3 3.8-1.2 6.5-3.3 9.4-1.9 2.6-3.8 5.1-3.6 8.5
               .3 4.8 4.2 8.4 9 8.2 5-.2 8.9-4.2 8.8-9.2
               -.1-3.8-2.3-7.2-4.1-10.4-1.6-2.9-2.9-6-2.4-9.3
               .1-.6.8-.9 1.2-.5 4.8 4.7 9.8 11.2 9.4 18.2
               -.5 9-8 16.1-17 15.6-8.8-.5-15.7-7.7-15.3-16.5
               .3-6.6 4.3-11.8 7.8-17.1 2.3-3.5 4.5-7.3 4.5-11.6
               0-.6.7-1 1.2-.6 2.3 2.1 3.5 5.5 3.8 9.3z" />
    </svg>
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Yard Heat home">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <FlameMark className="size-8" />
          </span>
          <span className="font-display text-xl tracking-tight text-foreground">Yard Heat</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm font-semibold text-foreground/85 sm:gap-2">
          <Link href="/shop" className="rounded-full px-3 py-2 transition-colors hover:bg-muted hover:text-foreground">
            Shop
          </Link>
          <Link
            href="/#heat"
            className="hidden rounded-full px-3 py-2 transition-colors hover:bg-muted hover:text-foreground sm:block"
          >
            Find your heat
          </Link>
          <CartLink />
        </nav>
      </div>
    </header>
  )
}
