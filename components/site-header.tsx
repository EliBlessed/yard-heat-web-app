import Link from "next/link"
import { Flame } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 sm:px-10">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Flame className="size-4" fill="currentColor" />
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
