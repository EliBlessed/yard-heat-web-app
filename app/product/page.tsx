import { SiteHeader } from "@/components/site-header"
import { ProductDetail } from "@/components/product-detail"

export default function ProductPage() {
  return (
    <main className="h-dvh overflow-hidden bg-background">
      <div className="flex h-full flex-col">
        <SiteHeader />
        <section className="flex-1 px-6 pb-6 sm:px-10">
          <ProductDetail />
        </section>
      </div>
    </main>
  )
}
