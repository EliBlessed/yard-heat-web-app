"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { getCategory, heatBands, products, type HeatBand, type ProductCategory } from "@/lib/product"
import { cn } from "@/lib/utils"

type TypeFilter = "all" | ProductCategory
type HeatFilter = "all" | HeatBand["id"]

const typeOptions: { id: TypeFilter; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "sauce", label: "Pepper sauces" },
  { id: "rub", label: "Spice rubs" },
]

const heatOptions: { id: HeatFilter; label: string }[] = [
  { id: "all", label: "Any heat" },
  ...heatBands.map((b) => ({ id: b.id, label: b.name })),
]

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { id: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold ring-1 transition-colors",
              selected
                ? "bg-foreground text-background ring-foreground"
                : "bg-card text-foreground ring-border hover:ring-foreground/40",
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export function ShopBrowser() {
  const router = useRouter()
  const params = useSearchParams()
  const typeParam = params.get("type")
  const heatParam = params.get("heat")
  const type: TypeFilter = typeOptions.some((o) => o.id === typeParam) ? (typeParam as TypeFilter) : "all"
  const heat: HeatFilter = heatOptions.some((o) => o.id === heatParam) ? (heatParam as HeatFilter) : "all"

  function update(next: { type?: TypeFilter; heat?: HeatFilter }) {
    const t = next.type ?? type
    const h = next.heat ?? heat
    const query = new URLSearchParams()
    if (t !== "all") query.set("type", t)
    if (h !== "all") query.set("heat", h)
    const qs = query.toString()
    router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false })
  }

  const visible = products.filter((p) => {
    const typeOk = type === "all" || getCategory(p) === type
    const heatOk = heat === "all" || heatBands.find((b) => b.id === heat)?.matches(p.heatLevel)
    return typeOk && heatOk
  })

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <FilterGroup label="Product type" options={typeOptions} value={type} onChange={(v) => update({ type: v })} />
        <FilterGroup label="Heat level" options={heatOptions} value={heat} onChange={(v) => update({ heat: v })} />
      </div>

      <p aria-live="polite" className="text-sm text-muted-foreground">
        Showing {visible.length} of {products.length} products
      </p>

      {visible.length === 0 ? (
        <div className="flex flex-col items-start gap-3 rounded-[1.75rem] bg-card p-8 ring-1 ring-border">
          <p className="text-base text-foreground">Nothing matches both filters yet.</p>
          <button
            type="button"
            onClick={() => update({ type: "all", heat: "all" })}
            className="text-sm font-semibold text-primary underline underline-offset-4"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product, i) => (
            <ProductCard key={product.slug} product={product} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  )
}
