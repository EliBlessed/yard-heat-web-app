import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductDetail } from "@/components/product-detail"
import { ProductCard, productRow, productRowItem } from "@/components/product-card"
import { getCategory, getHeatBand, getProduct, heatBands, products } from "@/lib/product"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return {}
  return {
    title: `${product.name} | Yard Heat`,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const band = getHeatBand(product.heatLevel)
  // Two more at the same heat, plus one of the same type from the next heat (one step down from Hot),
  // so the row of three is always full.
  const sameHeat = products.filter((p) => p.slug !== product.slug && band.matches(p.heatLevel)).slice(0, 2)
  const bandIndex = heatBands.findIndex((b) => b.id === band.id)
  const nextBand = heatBands[bandIndex === heatBands.length - 1 ? bandIndex - 1 : bandIndex + 1]
  const nextHeat = products.find(
    (p) => nextBand.matches(p.heatLevel) && getCategory(p) === getCategory(product) && !sameHeat.includes(p),
  )
  const related = nextHeat ? [...sameHeat, nextHeat] : sameHeat

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl px-5 pt-6 pb-16 sm:px-8">
        <Link
          href="/shop"
          className="mb-6 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Back to shop
        </Link>
        <ProductDetail product={product} />

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display mb-6 text-3xl leading-none tracking-tight text-foreground">
              You might also like
            </h2>
            <div className={productRow}>
              {related.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} className={productRowItem} morph={false} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
