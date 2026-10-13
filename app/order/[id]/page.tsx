import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { OrderReceipt } from "@/components/order-receipt"
import { ORDER_ID_PATTERN } from "@/lib/order"

export const metadata: Metadata = {
  title: "Your demo order | Yard Heat",
  robots: { index: false, follow: true },
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!ORDER_ID_PATTERN.test(id)) notFound()

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main id="main" className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 pt-10 pb-16 sm:px-8 md:pt-14">
        <OrderReceipt id={id} />
      </main>
      <SiteFooter />
    </div>
  )
}
