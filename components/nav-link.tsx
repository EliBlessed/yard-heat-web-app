"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

/** A header link that marks itself as the current page. `match` is the path prefix it owns. */
export function NavLink({ href, match, className, children }: { href: string; match: string; className?: string; children: React.ReactNode }) {
  const current = usePathname().startsWith(match)
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "rounded-full px-3 py-2.5 transition-colors hover:bg-muted hover:text-foreground",
        current && "bg-muted text-foreground",
        className,
      )}
    >
      {children}
    </Link>
  )
}
