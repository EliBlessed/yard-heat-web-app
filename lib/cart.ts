import { getProduct, type Product, type ProductSize } from "@/lib/product"

export const MAX_QUANTITY = 10
export const CART_STORAGE_KEY = "yard-heat-cart"

export type CartLine = {
  slug: string
  sizeId: string
  quantity: number
}

export type ResolvedCartLine = CartLine & {
  product: Product
  size: ProductSize
  lineTotalJMD: number
}

/** Rounds to a whole number and caps at the maximum. Returns null if the result is below 1. */
export function normalizeQuantity(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null
  const rounded = Math.round(value)
  if (rounded < 1) return null
  return Math.min(rounded, MAX_QUANTITY)
}

/**
 * Validates a cart read from storage. Malformed lines and invalid quantities are dropped
 * silently; lines whose product or size no longer exists set `removedUnavailable`.
 */
export function parseCart(raw: unknown): { lines: CartLine[]; removedUnavailable: boolean } {
  const lines: CartLine[] = []
  let removedUnavailable = false
  if (!Array.isArray(raw)) return { lines, removedUnavailable }

  for (const item of raw) {
    if (!item || typeof item !== "object") continue
    const { slug, sizeId, quantity } = item as Record<string, unknown>
    if (typeof slug !== "string" || typeof sizeId !== "string") continue

    const product = getProduct(slug)
    if (!product || !product.sizes.some((s) => s.id === sizeId)) {
      removedUnavailable = true
      continue
    }

    const qty = normalizeQuantity(quantity)
    if (qty === null) continue

    const existing = lines.find((l) => l.slug === slug && l.sizeId === sizeId)
    if (existing) existing.quantity = Math.min(existing.quantity + qty, MAX_QUANTITY)
    else lines.push({ slug, sizeId, quantity: qty })
  }
  return { lines, removedUnavailable }
}

/** Adds to an existing line or creates one. `capped` is true if the cap limited the result. */
export function addLine(lines: CartLine[], slug: string, sizeId: string, quantity: number) {
  const qty = normalizeQuantity(quantity)
  if (qty === null || !getProduct(slug)?.sizes.some((s) => s.id === sizeId)) {
    return { lines, capped: false }
  }
  const existing = lines.find((l) => l.slug === slug && l.sizeId === sizeId)
  const wanted = (existing?.quantity ?? 0) + qty
  const next = Math.min(wanted, MAX_QUANTITY)
  const capped = wanted > MAX_QUANTITY
  if (!existing) return { lines: [...lines, { slug, sizeId, quantity: next }], capped }
  return {
    lines: lines.map((l) => (l === existing ? { ...l, quantity: next } : l)),
    capped,
  }
}

export function setLineQuantity(lines: CartLine[], slug: string, sizeId: string, quantity: number) {
  const qty = normalizeQuantity(quantity)
  if (qty === null) return lines
  return lines.map((l) => (l.slug === slug && l.sizeId === sizeId ? { ...l, quantity: qty } : l))
}

export function removeLine(lines: CartLine[], slug: string, sizeId: string) {
  return lines.filter((l) => !(l.slug === slug && l.sizeId === sizeId))
}

export function resolveLines(lines: CartLine[]): ResolvedCartLine[] {
  const resolved: ResolvedCartLine[] = []
  for (const line of lines) {
    const product = getProduct(line.slug)
    const size = product?.sizes.find((s) => s.id === line.sizeId)
    if (!product || !size) continue
    resolved.push({ ...line, product, size, lineTotalJMD: size.priceJMD * line.quantity })
  }
  return resolved
}

export function cartSubtotal(lines: ResolvedCartLine[]) {
  return lines.reduce((sum, l) => sum + l.lineTotalJMD, 0)
}

export function cartItemCount(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.quantity, 0)
}
