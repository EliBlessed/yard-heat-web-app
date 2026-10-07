"use client"

import { useState } from "react"
import Image from "next/image"
import { PaymentForm } from "@/components/payment-form"
import { Separator } from "@/components/ui/separator"
import { formatJMD, getParishDeliveryFee, type Product, type ProductSize } from "@/lib/product"

export function CheckoutContent({ product, selected }: { product: Product; selected: ProductSize }) {
  const [parish, setParish] = useState<string | null>(null)
  const deliveryFee = getParishDeliveryFee(parish)
  const total = deliveryFee === null ? null : selected.priceJMD + deliveryFee

  return (
    <section className="grid flex-1 grid-cols-1 gap-6 overflow-hidden px-6 pb-6 sm:px-10 md:grid-cols-2 md:gap-10">
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-2xl text-foreground sm:text-3xl">Checkout</h1>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={`${product.name}`}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-sm font-semibold text-foreground">{product.name}</p>
            <p className="text-xs text-muted-foreground">
              {selected.label} &middot; {selected.volume}
            </p>
            <p className="text-xs text-muted-foreground">Qty: 1</p>
          </div>
          <p className="font-display text-lg text-primary">{formatJMD(selected.priceJMD)}</p>
        </div>

        <div className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-4 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="text-foreground">{formatJMD(selected.priceJMD)}</span>
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

      <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Payment details
        </h2>
        <PaymentForm onParishChange={setParish} />
      </div>
    </section>
  )
}
