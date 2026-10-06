"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { HeatRating } from "@/components/heat-rating"
import { sauce, formatJMD } from "@/lib/product"

export function ProductDetail() {
  const router = useRouter()
  const [sizeId, setSizeId] = useState(sauce.sizes[1].id)
  const selected = sauce.sizes.find((s) => s.id === sizeId) ?? sauce.sizes[0]

  function handleBuyNow() {
    router.push(`/checkout?size=${selected.id}`)
  }

  return (
    <div className="grid h-full grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-14">
      <div className="relative mx-auto flex h-full w-full max-w-sm items-center justify-center">
        <div className="absolute inset-4 rounded-[2.5rem] bg-gradient-to-br from-primary/15 via-secondary/15 to-transparent blur-2xl" />
        <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-card shadow-xl">
          <Image
            src={sauce.image || "/placeholder.svg"}
            alt={`Bottle of ${sauce.name}`}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{sauce.tagline}</p>
          <h1 className="font-display mt-1 text-3xl leading-tight text-balance text-foreground sm:text-4xl">
            {sauce.name}
          </h1>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{sauce.description}</p>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">Heat level</span>
          <HeatRating level={sauce.heatLevel} max={sauce.maxHeat} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Bottle size</span>
          <RadioGroup value={sizeId} onValueChange={setSizeId} className="flex flex-wrap gap-2">
            {sauce.sizes.map((size) => (
              <Label
                key={size.id}
                htmlFor={size.id}
                className={`flex cursor-pointer flex-col items-start gap-0.5 rounded-xl border px-3.5 py-2 transition-colors ${
                  sizeId === size.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className="flex items-center gap-2">
                  <RadioGroupItem value={size.id} id={size.id} />
                  <span className="text-sm font-semibold text-foreground">{size.label}</span>
                </span>
                <span className="pl-6 text-xs text-muted-foreground">{size.volume}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div className="mt-1 flex items-center justify-between gap-4 border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="font-display text-3xl text-primary">{formatJMD(selected.priceJMD)}</p>
          </div>
          <Button size="lg" className="rounded-full px-7 text-base" onClick={handleBuyNow}>
            Buy Now
            <ShoppingCart data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </div>
  )
}
