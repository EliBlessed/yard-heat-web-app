import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartContent } from "@/components/cart-content"

export default function CartPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1">
        <CartContent />
      </main>
      <SiteFooter />
    </div>
  )
}
