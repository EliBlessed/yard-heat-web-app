import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CheckoutContent } from "@/components/checkout-content"

export const metadata: Metadata = {
  title: "Demo checkout | Yard Heat",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: true },
}


export default function CheckoutPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main id="main" className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <CheckoutContent />
      </main>
      <SiteFooter />
    </div>
  )
}
