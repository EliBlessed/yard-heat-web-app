"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
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
  const still = useReducedMotion()

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
                "relative flex flex-col items-center justify-center rounded-full px-3 py-3 transition-colors sm:flex-row sm:gap-2",
                // With motion on, the sliding pill below paints the selected background.
                selected
                  ? cn(bandStyles[b.id].active, !still && "bg-transparent")
                  : cn(bandStyles[b.id].idle, "hover:brightness-95"),
              )}
            >
              {selected && !still && (
                // The coloured pill slides across to the chosen heat.
                <motion.span
                  layoutId="heat-pill"
                  className={cn("absolute inset-0 rounded-full", bandStyles[b.id].active)}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative font-display text-base sm:text-lg">{b.name}</span>
              <span className="relative text-xs font-semibold">
                {count} {count === 1 ? "product" : "products"}
              </span>
            </button>
          )
        })}
      </div>

      <p aria-live="polite" className="max-w-xl text-base text-muted-foreground">
        {band.description}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={band.id}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          initial={still ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={still ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {matches.map((product, i) => (
            <ProductCard key={product.slug} product={product} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      <Link
        href={`/shop?heat=${band.id}`}
        className="w-fit text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
      >
        See every {band.name.toLowerCase()} product in the shop
      </Link>
    </div>
  )
}
