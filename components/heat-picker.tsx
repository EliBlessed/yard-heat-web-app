"use client"

import { useState } from "react"
import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { heatBands, products, type HeatBand } from "@/lib/product"
import { cn } from "@/lib/utils"

const bandStyles: Record<HeatBand["id"], { idle: string; active: string }> = {
  gentle: { idle: "bg-scallion/10 text-scallion", active: "bg-scallion text-scallion-foreground" },
  medium: { idle: "bg-secondary/15 text-[#9a4511]", active: "bg-secondary text-secondary-foreground" },
  hot: { idle: "bg-primary/10 text-primary", active: "bg-primary text-primary-foreground" },
}

export function HeatPicker() {
  const [bandId, setBandId] = useState<HeatBand["id"]>("medium")
  const band = heatBands.find((b) => b.id === bandId) ?? heatBands[1]
  const matches = products.filter((p) => band.matches(p.heatLevel))

  return (
    <div className="flex flex-col gap-8">
      <div
        role="radiogroup"
        aria-label="Heat level"
        className="grid grid-cols-3 gap-1.5 rounded-full bg-card p-1.5 ring-1 ring-border"
      >
        {heatBands.map((b) => {
          const selected = b.id === bandId
          const count = products.filter((p) => b.matches(p.heatLevel)).length
          return (
            <button
              key={b.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setBandId(b.id)}
              className={cn(
                "flex flex-col items-center justify-center rounded-full px-3 py-3 transition-colors sm:flex-row sm:gap-2",
                selected ? bandStyles[b.id].active : cn(bandStyles[b.id].idle, "hover:brightness-95"),
              )}
            >
              <span className="font-display text-base sm:text-lg">{b.name}</span>
              <span className="text-xs font-semibold">
                {count} {count === 1 ? "product" : "products"}
              </span>
            </button>
          )
        })}
      </div>

      <p aria-live="polite" className="max-w-xl text-base text-muted-foreground">
        {band.description}
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>

      <Link
        href={`/shop?heat=${band.id}`}
        className="w-fit text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
      >
        See every {band.name.toLowerCase()} product in the shop
      </Link>
    </div>
  )
}
