import Link from "next/link"
import Image from "next/image"
import { HeatRating } from "@/components/heat-rating"
import { RiseIn } from "@/components/rise-in"
import { formatJMD, getCategory, getHeatBand, getLowestPrice, type Product } from "@/lib/product"

/** The full shop: two columns on phones, three on desktop. */
export const productGrid = "grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3"

/** A row of three: swipeable on phones, a grid from tablet width up. Pair each card with `productRowItem`. */
export const productRow =
  "-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
export const productRowItem = "flex w-[72%] shrink-0 snap-start sm:w-auto"

export function ProductCard({
  product,
  priority = false,
  headingLevel = 3,
  index = 0,
  className = "flex",
}: {
  product: Product
  priority?: boolean
  headingLevel?: 2 | 3
  /** Position in the grid, used to stagger the rise-in along each row. */
  index?: number
  /** Classes for the outer wrapper, e.g. a fixed width inside a phone carousel. */
  className?: string
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3"
  const band = getHeatBand(product.heatLevel)
  const category = getCategory(product)

  return (
    <RiseIn index={index} className={className}>
      <Link
        href={`/product/${product.slug}`}
        data-testid="product-card"
        className="group flex w-full flex-col overflow-hidden rounded-[1.75rem] bg-card ring-1 ring-border transition-[box-shadow,translate] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgb(122_16_22/0.45)] hover:ring-primary/40 motion-reduce:hover:translate-y-0"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 75vw"
            className="object-cover transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.05] group-hover:-rotate-2 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0"
          />
          <span className="absolute top-2.5 left-2.5 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground sm:top-3 sm:left-3 sm:px-3">
            {category === "rub" ? "Spice rub" : "Pepper sauce"}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3.5 sm:p-5">
          <Heading className="text-base leading-snug font-bold text-foreground sm:text-lg">{product.name}</Heading>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <HeatRating level={product.heatLevel} max={product.maxHeat} className="[&_svg]:size-4" />
            <span>{band.name}</span>
          </div>
          <p className="mt-auto pt-2 text-sm text-muted-foreground">
            From <span className="font-display text-xl text-primary">{formatJMD(getLowestPrice(product))}</span>
          </p>
        </div>
      </Link>
    </RiseIn>
  )
}
