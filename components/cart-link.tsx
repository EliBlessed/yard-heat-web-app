"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart-provider"

export function CartLink() {
  const { itemCount, ready } = useCart()
  const count = ready ? itemCount : 0

  return (
    <Link
      href="/cart"
      className="relative flex items-center transition-colors hover:text-primary"
      aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart"}
    >
      <ShoppingCart className="size-5" />
      {count > 0 && (
        <span className="absolute -top-2 -right-3 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-4 font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  )
}
