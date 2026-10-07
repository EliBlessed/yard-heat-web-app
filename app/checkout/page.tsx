import { SiteHeader } from "@/components/site-header"
import { CheckoutContent } from "@/components/checkout-content"

export default function CheckoutPage() {
  return (
    <main className="min-h-dvh bg-background">
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <CheckoutContent />
      </div>
    </main>
  )
}
