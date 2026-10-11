import Link from "next/link"
import { FlameMark } from "@/components/site-header"

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-foreground text-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <FlameMark className="size-8" />
            </span>
            <span className="font-display text-xl">Yard Heat</span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-background/70">
            Small-batch pepper sauces and spice rubs, cooked and bottled in Kingston with Jamaican Scotch bonnets.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-semibold">Shop</p>
          <Link href="/shop?type=sauce" className="text-background/70 hover:text-background">
            Pepper sauces
          </Link>
          <Link href="/shop?type=rub" className="text-background/70 hover:text-background">
            Spice rubs
          </Link>
          <Link href="/cart" className="text-background/70 hover:text-background">
            Your cart
          </Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-semibold">About this site</p>
          <p className="text-background/70">
            Yard Heat is a fictional brand. This is a demo shop: no payments are taken and no orders are shipped.
          </p>
          <p className="text-background/70">Started from a NextWork guided project.</p>
        </div>
      </div>
    </footer>
  )
}
