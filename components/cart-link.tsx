"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/components/cart-provider"

export function CartLink() {
  const { itemCount, ready } = useCart()
  const count = ready ? itemCount : 0

  return (
    <Link
      href="/cart"
      data-cart-target
      className="relative flex items-center gap-2 rounded-full bg-foreground px-3.5 py-2 text-background transition-colors hover:bg-primary"
      aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart"}
    >
      <ShoppingBag className="size-4" aria-hidden="true" />
      <span className="text-sm font-semibold" aria-hidden="true">
        Cart
      </span>
      {count > 0 && (
        <span
          data-testid="cart-count"
          className="flex min-w-5 items-center justify-center rounded-full bg-secondary px-1.5 text-xs leading-5 font-bold text-secondary-foreground"
          aria-hidden="true"
        >
          {count}
        </span>
      )}
    </Link>
  )
}
