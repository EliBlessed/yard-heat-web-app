import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { HeatRating } from "@/components/heat-rating"
import { products, getLowestPrice, formatJMD } from "@/lib/product"

export default function ShopPage() {
  return (
    <main className="min-h-dvh bg-background">
      <SiteHeader />
      <section className="px-6 pb-10 sm:px-10">
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">Shop</h1>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/product/${product.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-center transition-transform group-hover:scale-105"
                />
              </div>
              <h2 className="text-base font-semibold text-foreground">{product.name}</h2>
              <HeatRating level={product.heatLevel} max={product.maxHeat} />
              <p className="font-display text-xl text-primary">
                From {formatJMD(getLowestPrice(product))}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
