"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PARISH_MAP_VIEWBOX, parishPaths } from "@/lib/parish-map"
import { PARISH_STORAGE_KEY, formatJMD, parishDeliveryFees, parishes, type Parish } from "@/lib/product"
import { cn } from "@/lib/utils"

const fees = [...new Set(Object.values(parishDeliveryFees))].sort((a, b) => a - b)

// Scallion green for the cheapest parishes, through amber and orange, to pepper red for the dearest.
const ramp = ["#2f5d34", "#6f8f2e", "#d39b2a", "#e8762c", "#d0452a", "#b91c22"]
const feeColour = (fee: number) => ramp[fees.indexOf(fee)] // one colour per fee step (six of each)

const tiers = fees.map((fee) => ({ fee, parishes: parishes.filter((p) => parishDeliveryFees[p] === fee) }))

export function ParishMap() {
  const [active, setActive] = useState<Parish>("Kingston")
  const [chosen, setChosen] = useState<Parish | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PARISH_STORAGE_KEY)
      if (saved && (parishes as readonly string[]).includes(saved)) {
        setChosen(saved as Parish)
        setActive(saved as Parish)
      }
    } catch {
      // Storage blocked: the map still works, it just won't remember the parish.
    }
  }, [])

  function choose(parish: Parish) {
    setActive(parish)
    setChosen(parish)
    try {
      localStorage.setItem(PARISH_STORAGE_KEY, parish)
    } catch {}
  }

  return (
    <div className="flex flex-col gap-6 rounded-[2rem] bg-card p-5 ring-1 ring-border sm:p-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">
          Delivered to all {parishes.length} parishes
        </h2>
        <p aria-live="polite" className="text-muted-foreground">
          <span className="font-semibold text-foreground">{active}</span>: delivery{" "}
          <span className="font-semibold text-primary">{formatJMD(parishDeliveryFees[active])}</span>
          {chosen === active && ". We'll fill this in for you at checkout."}
        </p>
      </div>

      {/* Pointer users can hover and click the map; everyone can use the buttons below, which do the same. */}
      <svg viewBox={PARISH_MAP_VIEWBOX} className="h-auto w-full" aria-hidden="true">
        {parishes.map((parish) => (
          <path
            key={parish}
            d={parishPaths[parish]}
            data-parish={parish}
            onPointerEnter={() => setActive(parish)}
            onClick={() => choose(parish)}
            className={cn(
              "cursor-pointer stroke-card transition-[opacity,stroke-width] duration-200 ease-out",
              parish === active ? "opacity-100 [stroke-width:5]" : "opacity-80 [stroke-width:2] hover:opacity-100",
            )}
            style={{ fill: feeColour(parishDeliveryFees[parish]) }}
          />
        ))}
      </svg>

      <div data-testid="parish-fees" className="flex flex-col gap-3">
        {tiers.map((tier) => (
          <div key={tier.fee} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p className="flex w-24 shrink-0 items-center gap-2 text-sm font-semibold text-foreground">
              <span className="size-3 rounded-full" style={{ background: feeColour(tier.fee) }} />
              {formatJMD(tier.fee)}
            </p>
            <ul className="flex flex-wrap gap-2" aria-label={`${formatJMD(tier.fee)} delivery`}>
              {tier.parishes.map((parish) => (
                <li key={parish}>
                  <button
                    type="button"
                    aria-pressed={chosen === parish}
                    onClick={() => choose(parish)}
                    onFocus={() => setActive(parish)}
                    onPointerEnter={() => setActive(parish)}
                    className={cn(
                      "min-h-10 whitespace-nowrap rounded-full px-4 py-2 text-sm ring-1 transition-colors",
                      chosen === parish ? "bg-foreground text-background ring-foreground" : "ring-border hover:bg-muted",
                    )}
                  >
                    {parish}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Button size="lg" className="h-12 self-start rounded-full px-7 text-base" nativeButton={false} render={<Link href="/shop" />}>
        Start shopping
      </Button>
    </div>
  )
}
