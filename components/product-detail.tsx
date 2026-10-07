"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Check, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { HeatRating } from "@/components/heat-rating"
import { useCart } from "@/components/cart-provider"
import { QuantitySelect, BulkOrderNote } from "@/components/quantity-select"
import { MAX_QUANTITY } from "@/lib/cart"
import { formatJMD, type Product } from "@/lib/product"

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter()
  const [sizeId, setSizeId] = useState((product.sizes[1] ?? product.sizes[0]).id)
  const selected = product.sizes.find((s) => s.id === sizeId) ?? product.sizes[0]
  const { add } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [status, setStatus] = useState<"added" | "capped" | null>(null)

  useEffect(() => {
    if (!status) return
    const timer = setTimeout(() => setStatus(null), 2500)
    return () => clearTimeout(timer)
  }, [status])

  function handleAddToCart() {
    const capped = add(product.slug, selected.id, quantity)
    setStatus(capped ? "capped" : "added")
  }

  function handleBuyNow() {
    add(product.slug, selected.id, quantity)
    router.push("/checkout")
  }

  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-14">
      <div className="relative mx-auto flex w-full max-w-sm items-center justify-center">
        <div className="absolute inset-4 rounded-[2.5rem] bg-gradient-to-br from-primary/15 via-secondary/15 to-transparent blur-2xl" />
        <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-card shadow-xl">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={`${product.name}`}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{product.tagline}</p>
          <h1 className="font-display mt-1 text-3xl leading-tight text-balance text-foreground sm:text-4xl">
            {product.name}
          </h1>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{product.description}</p>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">Heat level</span>
          <HeatRating level={product.heatLevel} max={product.maxHeat} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">{product.sizeHeading}</span>
          <RadioGroup value={sizeId} onValueChange={setSizeId} className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <Label
                key={size.id}
                htmlFor={`${product.slug}-${size.id}`}
                className={`flex cursor-pointer flex-col items-start gap-0.5 rounded-xl border px-3.5 py-2 transition-colors ${
                  sizeId === size.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className="flex items-center gap-2">
                  <RadioGroupItem value={size.id} id={`${product.slug}-${size.id}`} />
                  <span className="text-sm font-semibold text-foreground">{size.label}</span>
                </span>
                <span className="pl-6 text-xs text-muted-foreground">{size.volume}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={`${product.slug}-quantity`} className="text-sm font-medium text-foreground">
            Quantity
          </Label>
          <QuantitySelect id={`${product.slug}-quantity`} value={quantity} onChange={setQuantity} />
          <BulkOrderNote />
        </div>

        <div className="mt-1 flex flex-col gap-3 border-t border-border pt-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="font-display text-3xl text-primary">{formatJMD(selected.priceJMD)}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-5 text-base"
                onClick={handleAddToCart}
              >
                {status === "added" ? (
                  <>
                    Added to cart
                    <Check data-icon="inline-end" />
                  </>
                ) : (
                  <>
                    Add to cart
                    <Plus data-icon="inline-end" />
                  </>
                )}
              </Button>
              <Button size="lg" className="rounded-full px-7 text-base" onClick={handleBuyNow}>
                Buy Now
                <ShoppingCart data-icon="inline-end" />
              </Button>
            </div>
          </div>
          <p role="status" className="min-h-4 text-xs text-muted-foreground">
            {status === "added" && "Added to cart"}
            {status === "capped" && `Maximum ${MAX_QUANTITY} per item`}
          </p>
        </div>
      </div>
    </div>
  )
}
