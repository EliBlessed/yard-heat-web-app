import { SiteHeader } from "@/components/site-header"
import { CartContent } from "@/components/cart-content"

export default function CartPage() {
  return (
    <main className="min-h-dvh bg-background">
      <SiteHeader />
      <CartContent />
    </main>
  )
}
