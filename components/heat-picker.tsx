"use client"

import { useState } from "react"
import Link from "next/link"
import { Flame } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ProductCard, productRow, productRowItem } from "@/components/product-card"
import { getHeatBand, products } from "@/lib/product"
import { cn } from "@/lib/utils"

const MAX_HEAT = 5
const ROW = 3

/** The three products nearest the chosen heat; ties go towards the milder side below medium and the hotter side above. */
function nearest(level: number) {
  const towardsHot = level >= 3
  return [...products]
    .sort((a, b) => {
      const gap = Math.abs(a.heatLevel - level) - Math.abs(b.heatLevel - level)
      return gap || (towardsHot ? b.heatLevel - a.heatLevel : a.heatLevel - b.heatLevel)
    })
    .slice(0, ROW)
}

export function HeatPicker() {
  const [level, setLevel] = useState(3)
  const band = getHeatBand(level)
  const matches = nearest(level)
  const still = useReducedMotion()

  return (
    <div
      data-testid="heat-panel"
      className="flex flex-col gap-8 rounded-[2rem] p-5 ring-1 ring-border transition-[background-color] duration-300 ease-out sm:p-8"
      // The panel warms from cream towards ember as the heat goes up.
      style={{ backgroundColor: `color-mix(in oklab, var(--card), var(--primary) ${(level - 1) * 4}%)` }}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-end justify-between gap-4">
          <div aria-hidden="true" className="flex items-end gap-1 sm:gap-2">
            {Array.from({ length: MAX_HEAT }, (_, i) => {
              const lit = i < level
              return (
                <span
                  key={i}
                  className="flex origin-bottom transition-transform duration-300 ease-out"
                  style={{ transform: `scale(${lit ? 0.8 + i * 0.12 : 0.7})` }}
                >
                  <Flame
                    className={cn(
                      "size-7 origin-bottom transition-colors duration-300 sm:size-9",
                      lit ? "fill-primary text-primary" : "fill-transparent text-muted-foreground/40",
                      lit && "heat-flicker", // CSS stops the flicker for reduced motion
                    )}
                    style={{ animationDelay: `${i * -0.37}s` }}
                  />
                </span>
              )
            })}
          </div>
          <p className="text-right font-display text-2xl text-foreground sm:text-3xl">
            {band.name}
            <span className="block text-sm font-sans font-semibold text-muted-foreground">
              {level} of {MAX_HEAT} flames
            </span>
          </p>
        </div>

        <input
          type="range"
          min={1}
          max={MAX_HEAT}
          step={1}
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          aria-label="Heat level"
          aria-valuetext={`${level} of ${MAX_HEAT} flames, ${band.name}`}
          className="heat-slider h-10 w-full cursor-pointer"
        />
      </div>

      <p aria-live="polite" className="max-w-xl text-base text-muted-foreground">
        {band.description}
      </p>

      <div className={productRow}>
        <AnimatePresence mode="popLayout" initial={false}>
          {matches.map((product, i) => (
            <motion.div
              key={product.slug}
              layout={!still}
              className={productRowItem}
              initial={still ? false : { opacity: 0, transform: "translateY(16px) scale(0.96)" }}
              animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
              exit={still ? undefined : { opacity: 0, transform: "translateY(-12px) scale(0.96)" }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <ProductCard product={product} index={i} className="flex w-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Link
        href={`/shop?heat=${band.id}`}
        className="inline-flex min-h-10 w-fit items-center text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
      >
        See every {band.name.toLowerCase()} product in the shop
      </Link>
    </div>
  )
}
