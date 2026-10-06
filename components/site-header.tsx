import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 sm:px-10">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-[#B30D1B] text-[#FFFDF7]">
            <svg viewBox="0 0 100 100" fill="currentColor" className="size-5" aria-hidden="true">
              <path d="M51 37.5
                       c.3 3.8-1.2 6.5-3.3 9.4-1.9 2.6-3.8 5.1-3.6 8.5
                       .3 4.8 4.2 8.4 9 8.2 5-.2 8.9-4.2 8.8-9.2
                       -.1-3.8-2.3-7.2-4.1-10.4-1.6-2.9-2.9-6-2.4-9.3
                       .1-.6.8-.9 1.2-.5 4.8 4.7 9.8 11.2 9.4 18.2
                       -.5 9-8 16.1-17 15.6-8.8-.5-15.7-7.7-15.3-16.5
                       .3-6.6 4.3-11.8 7.8-17.1 2.3-3.5 4.5-7.3 4.5-11.6
                       0-.6.7-1 1.2-.6 2.3 2.1 3.5 5.5 3.8 9.3z" />
            </svg>
          </span>
        <span className="font-display text-lg tracking-tight text-foreground">YARD HEAT</span>
      </Link>
      <nav className="flex items-center gap-6 text-sm font-medium text-foreground/80">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <Link href="/product" className="hover:text-primary transition-colors">
          Shop
        </Link>
      </nav>
    </header>
  )
}
