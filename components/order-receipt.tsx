"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FlameBurst } from "@/components/flame-burst"
import { ORDER_STORAGE_PREFIX, type Order } from "@/lib/order"
import { formatJMD, getProduct, servingIdeas } from "@/lib/product"

/** The receipt lives only in this tab's sessionStorage, written by the checkout when the order goes through. */
function readOrder(id: string): Order | null {
  try {
    const order = JSON.parse(sessionStorage.getItem(ORDER_STORAGE_PREFIX + id) ?? "null")
    return order?.id === id && Array.isArray(order.lines) ? order : null
  } catch {
    return null
  }
}

export function OrderReceipt({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined)
  useEffect(() => setOrder(readOrder(id)), [id])

  if (order === undefined) return <section className="flex-1" aria-busy="true" />

  if (order === null) {
    return (
      <section className="flex flex-1 flex-col items-start justify-center gap-6">
        <h1 className="font-display text-5xl leading-none tracking-tight text-foreground">Receipt not on this device</h1>
        <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
          Demo receipts are kept only in the browser tab that placed the order, so this one can&rsquo;t be shown here.
        </p>
        <Button size="lg" className="h-12 rounded-full px-7 text-base" nativeButton={false} render={<Link href="/shop" />}>
          Browse the shop
        </Button>
      </section>
    )
  }

  const first = order.lines[0]
  const idea = first && servingIdeas[first.slug]?.[0]

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-3">
        <span className="relative flex size-16 items-center justify-center">
          <FlameBurst />
          <CheckCircle2 className="size-10 text-primary" />
        </span>
        <h1 className="font-display text-5xl leading-none tracking-tight text-foreground sm:text-6xl">Demo order placed</h1>
        <p className="text-muted-foreground">
          Order number <span className="font-semibold text-foreground">{order.id}</span>
        </p>
        <p className="max-w-md text-sm text-muted-foreground">
          No payment was taken and nothing will be shipped. Thanks for trying the shop.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {order.lines.map((line) => {
          const image = getProduct(line.slug)?.image
          return (
            <li key={`${line.slug}-${line.sizeId}`} className="flex items-center gap-4 rounded-[1.5rem] bg-card p-4 ring-1 ring-border">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-muted">
                {image && <Image src={image} alt="" fill sizes="64px" className="object-cover" />}
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-sm font-semibold text-foreground">{line.name}</p>
                <p className="text-xs text-muted-foreground">
                  {line.sizeLabel} &middot; Qty {line.quantity}
                </p>
              </div>
              <p className="font-display text-lg text-primary">{formatJMD(line.lineTotalJMD)}</p>
            </li>
          )
        })}
      </ul>

      <div className="flex flex-col gap-2.5 rounded-[1.5rem] bg-card p-4 text-sm ring-1 ring-border">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="text-foreground">{formatJMD(order.subtotalJMD)}</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Delivery to {order.parish}</span>
          <span className="text-foreground">{formatJMD(order.deliveryJMD)}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between font-display text-lg text-foreground">
          <span>Total</span>
          <span className="text-primary">{formatJMD(order.totalJMD)}</span>
        </div>
      </div>

      {idea && (
        <div className="rounded-[1.5rem] bg-secondary/15 p-5">
          <h2 className="font-display text-xl text-foreground">Cook this first</h2>
          <p className="mt-1 text-muted-foreground">
            {first.name}: {idea.charAt(0).toLowerCase() + idea.slice(1)}.
          </p>
        </div>
      )}

      <Button size="lg" className="h-12 self-start rounded-full px-7 text-base" nativeButton={false} render={<Link href="/shop" />}>
        Keep shopping
      </Button>
    </section>
  )
}
