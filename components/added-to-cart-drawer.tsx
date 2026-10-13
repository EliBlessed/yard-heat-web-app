"use client"

import Link from "next/link"
import Image from "next/image"
import { Drawer } from "@base-ui/react/drawer"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { cartSubtotal, resolveLines } from "@/lib/cart"
import { formatJMD, type Product, type ProductSize } from "@/lib/product"

/**
 * Slides in from the right after "Add to cart": what was just added, the cart total and the next step,
 * without leaving the product page. Swipe right or press Escape to close.
 */
export function AddedToCartDrawer({
  open,
  onOpenChange,
  product,
  size,
  quantity,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
  size: ProductSize
  quantity: number
}) {
  const { lines, itemCount } = useCart()
  const subtotal = cartSubtotal(resolveLines(lines))

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <Drawer.Portal>
        <Drawer.Backdrop className="cart-drawer-backdrop fixed inset-0 z-50 bg-foreground/40" />
        <Drawer.Viewport className="fixed inset-0 z-50 flex justify-end">
          <Drawer.Popup className="cart-drawer flex h-full w-[min(24rem,90vw)] flex-col gap-5 bg-card p-5 shadow-[0_0_60px_-20px_rgb(43_21_16/0.5)] outline-none sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <Drawer.Title className="font-display text-2xl text-foreground">Added to your cart</Drawer.Title>
              <Drawer.Close render={<Button variant="ghost" size="icon" aria-label="Close" />}>
                <X />
              </Drawer.Close>
            </div>

            <div className="flex items-center gap-4 rounded-[1.5rem] bg-background p-3 ring-1 ring-border">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
                <Image src={product.image} alt="" fill sizes="80px" className="object-cover" />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-foreground">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {size.label} &middot; {size.volume} &middot; Qty {quantity}
                </p>
                <p className="font-display text-lg text-primary">{formatJMD(size.priceJMD * quantity)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Cart subtotal, {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
              <span className="font-semibold text-foreground">{formatJMD(subtotal)}</span>
            </div>

            <div className="mt-auto flex flex-col gap-2">
              <Button size="lg" className="h-12 rounded-full text-base" nativeButton={false} render={<Link href="/checkout" />}>
                Checkout
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-foreground/20 bg-transparent text-base"
                nativeButton={false}
                render={<Link href="/cart" />}
              >
                View cart
              </Button>
              <Drawer.Close render={<Button size="lg" variant="ghost" className="h-12 rounded-full text-base" />}>
                Keep browsing
              </Drawer.Close>
            </div>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
