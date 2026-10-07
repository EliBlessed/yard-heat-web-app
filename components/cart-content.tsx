"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { QuantitySelect, BulkOrderNote } from "@/components/quantity-select"
import { cartSubtotal, resolveLines } from "@/lib/cart"
import { formatJMD } from "@/lib/product"

export function CartContent() {
  const { lines, ready, removedUnavailable, dismissRemovedNotice, setQuantity, remove } = useCart()

  if (!ready) return <section className="px-6 pb-10 sm:px-10" aria-busy="true" />

  const items = resolveLines(lines)
  const subtotal = cartSubtotal(items)

  return (
    <section className="px-6 pb-10 sm:px-10">
      <h1 className="font-display text-3xl text-foreground sm:text-4xl">Your cart</h1>

      {removedUnavailable && (
        <div
          role="status"
          className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 text-sm text-foreground"
        >
          <p>An item in your cart is no longer available and was removed.</p>
          <Button variant="ghost" size="sm" onClick={dismissRemovedNotice}>
            Dismiss
          </Button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Your cart is empty.</p>
          <Button
            size="lg"
            className="rounded-full px-7 text-base"
            nativeButton={false}
            render={<Link href="/shop" />}
          >
            Browse the shop
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1fr_20rem]">
          <ul className="flex flex-col gap-4">
            {items.map((item) => (
              <li
                key={`${item.slug}-${item.sizeId}`}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex min-w-40 flex-1 flex-col gap-0.5">
                  <Link
                    href={`/product/${item.slug}`}
                    className="text-sm font-semibold text-foreground hover:text-primary"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {item.size.label} &middot; {item.size.volume}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatJMD(item.size.priceJMD)} each</p>
                </div>
                <QuantitySelect
                  value={item.quantity}
                  onChange={(q) => setQuantity(item.slug, item.sizeId, q)}
                  label={`Quantity for ${item.product.name}, ${item.size.label}`}
                />
                <p className="font-display w-24 text-right text-lg text-primary">
                  {formatJMD(item.lineTotalJMD)}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${item.product.name}, ${item.size.label}`}
                  onClick={() => remove(item.slug, item.sizeId)}
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
            <li>
              <BulkOrderNote />
            </li>
          </ul>

          <div className="flex h-fit flex-col gap-3 rounded-2xl border border-border bg-card p-4 text-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground">{formatJMD(subtotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Delivery is calculated at checkout.</p>
            <Separator />
            <Button
              size="lg"
              className="w-full rounded-full text-base"
              nativeButton={false}
              render={<Link href="/checkout" />}
            >
              Checkout
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
