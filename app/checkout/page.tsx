import { redirect } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { CheckoutContent } from "@/components/checkout-content"
import { getProduct } from "@/lib/product"

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; size?: string }>
}) {
  const { product: productSlug, size } = await searchParams
  const product = getProduct(productSlug)
  const selected = product?.sizes.find((s) => s.id === size)
  if (!product || !selected) redirect("/shop")

  return (
    <main className="h-dvh overflow-hidden bg-background">
      <div className="flex h-full flex-col">
        <SiteHeader />
        <CheckoutContent product={product} selected={selected} />
      </div>
    </main>
  )
}
