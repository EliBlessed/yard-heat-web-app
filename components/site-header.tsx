import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 sm:px-10">
      <Link href="/" className="flex items-center gap-2">
<span className="flex size-8 items-center justify-center rounded-full bg-[#B30D1B] text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M12.001 2c-.36 0-.71.18-.91.49-.66 1.01-1.63 2.5-2.22 3.66C7.36 9.1 6.5 11.47 6.5 13.88 6.5 17.81 8.96 21 12 21s5.5-3.19 5.5-7.12c0-2.82-1.34-5.32-2.73-7.52-.94-1.48-1.92-2.88-2.38-3.79-.17-.33-.53-.57-.38-.57zm-.03 5.4c1.29 1.95 2.53 4.09 2.53 6.48 0 2.21-1.12 4.12-2.5 4.12s-2.5-1.91-2.5-4.12c0-1.4.52-2.76 1.25-4.04.42-.74.87-1.47 1.22-2.44z" />
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
