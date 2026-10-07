import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { ProductDetail } from "@/components/product-detail"
import { getProduct, products } from "@/lib/product"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  return (
    <main className="h-dvh overflow-hidden bg-background">
      <div className="flex h-full flex-col">
        <SiteHeader />
        <section className="flex-1 px-6 pb-6 sm:px-10">
          <ProductDetail product={product} />
        </section>
      </div>
    </main>
  )
}
