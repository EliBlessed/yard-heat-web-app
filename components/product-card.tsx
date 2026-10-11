import Link from "next/link"
import Image from "next/image"
import { HeatRating } from "@/components/heat-rating"
import { formatJMD, getCategory, getHeatBand, getLowestPrice, type Product } from "@/lib/product"

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const band = getHeatBand(product.heatLevel)
  const category = getCategory(product)

  return (
    <Link
      href={`/product/${product.slug}`}
      data-testid="product-card"
      className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-card ring-1 ring-border transition-shadow hover:shadow-[0_18px_40px_-20px_rgb(122_16_22/0.45)] hover:ring-primary/40"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground">
          {category === "rub" ? "Spice rub" : "Pepper sauce"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg leading-snug font-bold text-foreground">{product.name}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <HeatRating level={product.heatLevel} max={product.maxHeat} className="[&_svg]:size-4" />
          <span>{band.name}</span>
        </div>
        <p className="mt-auto pt-2 text-sm text-muted-foreground">
          From <span className="font-display text-xl text-primary">{formatJMD(getLowestPrice(product))}</span>
        </p>
      </div>
    </Link>
  )
}
