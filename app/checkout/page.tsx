import { SiteHeader } from "@/components/site-header"
import { CheckoutContent } from "@/components/checkout-content"
import { sauce } from "@/lib/product"

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ size?: string }>
}) {
  const { size } = await searchParams
  const selected = sauce.sizes.find((s) => s.id === size) ?? sauce.sizes[1]

  return (
    <main className="h-dvh overflow-hidden bg-background">
      <div className="flex h-full flex-col">
        <SiteHeader />
        <CheckoutContent selected={selected} />
      </div>
    </main>
  )
}
