"use client"

import { useEffect, useRef, useState } from "react"
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
import { flyToCart } from "@/lib/fly-to-cart"
import { formatJMD, getHeatBand, servingIdeas, type Product } from "@/lib/product"

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter()
  const [sizeId, setSizeId] = useState((product.sizes[1] ?? product.sizes[0]).id)
  const selected = product.sizes.find((s) => s.id === sizeId) ?? product.sizes[0]
  const { add } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [status, setStatus] = useState<"added" | "capped" | null>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!status) return
    const timer = setTimeout(() => setStatus(null), 2500)
    return () => clearTimeout(timer)
  }, [status])

  function handleAddToCart() {
    const capped = add(product.slug, selected.id, quantity)
    setStatus(capped ? "capped" : "added")
    if (!capped) flyToCart(imageRef.current)
  }

  function handleBuyNow() {
    add(product.slug, selected.id, quantity)
    router.push("/checkout")
  }

  const band = getHeatBand(product.heatLevel)

  return (
    <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-14">
      <div className="relative mx-auto flex w-full max-w-md items-center justify-center md:sticky md:top-24">
        <div
          ref={imageRef}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-t-[12rem] rounded-b-[2rem] bg-muted shadow-[0_30px_60px_-30px_rgb(122_16_22/0.55)]">
          <Image
            src={product.image}
            alt={`${product.name}`}
            fill
            sizes="(min-width: 768px) 28rem, 90vw"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="font-display text-4xl leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl">
          {product.name}
        </h1>

        <p className="max-w-prose text-base leading-relaxed text-muted-foreground">{product.description}</p>

        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-card px-4 py-3 ring-1 ring-border">
          <HeatRating level={product.heatLevel} max={product.maxHeat} />
          <span className="text-sm font-semibold text-foreground">
            {band.name} heat, {product.heatLevel} of {product.maxHeat}
          </span>
        </div>

        {servingIdeas[product.slug] && (
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-foreground">Try it on</h2>
            <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
              {servingIdeas[product.slug].map((idea) => (
                <li key={idea} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
                  {idea}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">{product.sizeHeading}</span>
          <RadioGroup
            value={sizeId}
            onValueChange={setSizeId}
            className={`grid gap-2 ${product.sizes.length === 3 ? "grid-cols-3" : "grid-cols-2 sm:max-w-sm"}`}
          >
            {product.sizes.map((size) => (
              <Label
                key={size.id}
                htmlFor={`${product.slug}-${size.id}`}
                className={`flex cursor-pointer flex-col items-start gap-0.5 rounded-2xl border-2 px-3 py-2.5 transition-colors sm:px-4 ${
                  sizeId === size.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-foreground/30"
                }`}
              >
                <span className="flex items-center gap-2">
                  <RadioGroupItem value={size.id} id={`${product.slug}-${size.id}`} />
                  <span className="text-sm font-semibold text-foreground">{size.label}</span>
                </span>
                <span className="flex flex-col text-xs text-muted-foreground sm:pl-6">
                  {size.volume}
                  <span className="font-semibold text-foreground">{formatJMD(size.priceJMD)}</span>
                </span>
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
              <p data-testid="product-price" className="font-display text-4xl text-primary">
                {formatJMD(selected.priceJMD)}
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-foreground/20 bg-transparent px-5 text-base"
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
              <Button size="lg" className="h-12 rounded-full px-7 text-base" onClick={handleBuyNow}>
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
