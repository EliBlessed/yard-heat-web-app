import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductDetail } from "@/components/product-detail"
import { ProductCard } from "@/components/product-card"
import { getHeatBand, getProduct, products } from "@/lib/product"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return {}
  return { title: `${product.name} | Yard Heat`, description: product.description }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const band = getHeatBand(product.heatLevel)
  const related = products.filter((p) => p.slug !== product.slug && band.matches(p.heatLevel)).slice(0, 3)

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl px-5 pt-6 pb-16 sm:px-8">
        <Link
          href="/shop"
          className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Back to shop
        </Link>
        <ProductDetail product={product} />

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display mb-6 text-3xl leading-none tracking-tight text-foreground">
              More at {band.name.toLowerCase()} heat
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
