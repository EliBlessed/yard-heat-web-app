import { Suspense } from "react"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ShopBrowser } from "@/components/shop-browser"

export const metadata: Metadata = {
  title: "Shop | Yard Heat",
  description: "Jamaican pepper sauces and spice rubs, from gentle to proper yard heat.",
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
        <Suspense fallback={<div className="h-96" aria-busy="true" />}>
          <ShopBrowser />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  )
}
