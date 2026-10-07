"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { PaymentForm } from "@/components/payment-form"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { cartSubtotal, resolveLines, type ResolvedCartLine } from "@/lib/cart"
import { formatJMD, getParishDeliveryFee } from "@/lib/product"

export function CheckoutContent() {
  const router = useRouter()
  const { lines, ready, clear } = useCart()
  const [parish, setParish] = useState<string | null>(null)
  // Once the demo order is placed the cart is emptied; keep showing what was ordered.
  const [placedItems, setPlacedItems] = useState<ResolvedCartLine[] | null>(null)

  const liveItems = resolveLines(lines)
  const items = placedItems ?? liveItems
  const cartIsEmpty = ready && liveItems.length === 0 && placedItems === null

  useEffect(() => {
    if (cartIsEmpty) router.replace("/cart")
  }, [cartIsEmpty, router])

  if (!ready || cartIsEmpty) return <section className="flex-1" aria-busy="true" />

  const subtotal = cartSubtotal(items)
  const deliveryFee = getParishDeliveryFee(parish)
  const total = deliveryFee === null ? null : subtotal + deliveryFee

  function handleOrderPlaced() {
    setPlacedItems(liveItems)
    clear()
  }

  return (
    <section className="grid flex-1 grid-cols-1 gap-6 px-6 pb-8 sm:px-10 md:grid-cols-2 md:gap-10">
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-2xl text-foreground sm:text-3xl">Checkout</h1>

        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={`${item.slug}-${item.sizeId}`}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-sm font-semibold text-foreground">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.size.label} &middot; {item.size.volume}
                </p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-display text-lg text-primary">{formatJMD(item.lineTotalJMD)}</p>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-4 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="text-foreground">{formatJMD(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Delivery</span>
            <span className="text-foreground">
              {deliveryFee === null ? "Select a parish to see delivery" : formatJMD(deliveryFee)}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between font-display text-lg text-foreground">
            <span>Total</span>
            <span className="text-primary">
              {total === null ? "Select a parish" : formatJMD(total)}
            </span>
          </div>
        </div>

        <p className="mt-auto text-xs text-muted-foreground">
          Orders ship within 2-3 business days across Jamaica.
        </p>
      </div>

      <div className="flex flex-col rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Payment details
        </h2>
        <PaymentForm onParishChange={setParish} onOrderPlaced={handleOrderPlaced} />
      </div>
    </section>
  )
}
