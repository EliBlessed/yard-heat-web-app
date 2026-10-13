"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { PaymentForm } from "@/components/payment-form"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { cartSubtotal, resolveLines, type ResolvedCartLine } from "@/lib/cart"
import { formatJMD, getParishDeliveryFee } from "@/lib/product"
import { ORDER_STORAGE_PREFIX, type Order } from "@/lib/order"

export function CheckoutContent() {
  const router = useRouter()
  const { lines, ready, clear } = useCart()
  const [parish, setParish] = useState<string | null>(null)
  // Once the order is placed the cart is emptied; keep showing what was ordered until the receipt opens.
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

  async function placeOrder(chosenParish: string) {
    let res: Response
    try {
      res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Only what the order needs: the name and address never leave the browser.
        body: JSON.stringify({
          parish: chosenParish,
          lines: liveItems.map(({ slug, sizeId, quantity }) => ({ slug, sizeId, quantity })),
        }),
      })
    } catch {
      return "We couldn't reach the shop. Check your connection and try again."
    }
    const data = await res.json().catch(() => null)
    if (!res.ok || !data?.id) return data?.error ? `That order didn't go through: ${data.error}.` : "Something went wrong. Please try again."

    const order = data as Order
    try {
      sessionStorage.setItem(ORDER_STORAGE_PREFIX + order.id, JSON.stringify(order))
    } catch {
      // Storage blocked: the receipt page will say it can't find the order, but the order still went through.
    }
    setPlacedItems(liveItems)
    clear()
    router.push(`/order/${order.id}`)
    return null
  }

  return (
    <section className="grid flex-1 grid-cols-1 gap-6 px-5 pt-10 pb-16 sm:px-8 md:pt-14 md:grid-cols-2 md:gap-10">
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-5xl leading-none tracking-tight text-foreground sm:text-6xl">Checkout</h1>

        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={`${item.slug}-${item.sizeId}`}
              className="flex items-center gap-4 rounded-[1.5rem] bg-card ring-1 ring-border p-4"
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  sizes="80px"
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

        <div className="flex flex-col gap-2.5 rounded-[1.5rem] bg-card ring-1 ring-border p-4 text-sm">
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

      <div className="flex flex-col rounded-[1.5rem] bg-card ring-1 ring-border p-5">
        <h2 className="mb-4 font-display text-2xl text-foreground">
          Delivery details
        </h2>
        <PaymentForm onParishChange={setParish} onPlaceOrder={placeOrder} />
      </div>
    </section>
  )
}
