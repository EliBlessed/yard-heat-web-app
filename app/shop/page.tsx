import { Suspense } from "react"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ShopBrowser } from "@/components/shop-browser"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/product"

export const metadata: Metadata = {
  title: "Shop | Yard Heat",
  description: "Jamaican pepper sauces and spice rubs, from gentle to proper yard heat.",
  alternates: { canonical: "/shop" },
}

export default function ShopPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl px-5 pt-10 pb-16 sm:px-8 md:pt-14">
        <div className="mb-8 flex flex-col gap-3">
          <h1 className="font-display text-5xl leading-none tracking-tight text-foreground sm:text-6xl">Shop</h1>
          <p className="max-w-xl text-base text-muted-foreground">
            Four pepper sauces and two dry rubs, all built on Jamaican Scotch bonnet.
          </p>
        </div>
        <Suspense
          fallback={
            // Same layout as the filtered view, so nothing jumps when the filters load.
            <div className="flex flex-col gap-8" aria-busy="true">
              <div className="h-[5.5rem] md:h-10" />
              <p className="text-sm text-muted-foreground">Showing {products.length} of {products.length} products</p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product, i) => (
                  <ProductCard key={product.slug} product={product} priority={i < 3} headingLevel={2} />
                ))}
              </div>
            </div>
          }
        >
          <ShopBrowser />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  )
}
