import { MAX_QUANTITY } from "@/lib/cart"
import { getParishDeliveryFee, getProduct, type Parish } from "@/lib/product"

export type OrderLine = {
  slug: string
  sizeId: string
  quantity: number
  name: string
  sizeLabel: string
  unitPriceJMD: number
  lineTotalJMD: number
}

export type Order = {
  id: string
  placedAt: string
  parish: Parish
  lines: OrderLine[]
  subtotalJMD: number
  deliveryJMD: number
  totalJMD: number
}

export const ORDER_STORAGE_PREFIX = "yard-heat-order:"
/** Every product and size once, with room to spare. */
const MAX_LINES = 30

// No 0/O or 1/I, so a number read aloud or copied by hand can't be mistaken.
const ID_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
export const ORDER_ID_PATTERN = /^YH-[2-9A-HJ-NP-Z]{6}$/

function newOrderId() {
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  return "YH-" + Array.from(bytes, (b) => ID_CHARS[b % ID_CHARS.length]).join("")
}

/**
 * Prices an order from the server's own catalogue. Only slugs, sizes, quantities and the parish are
 * read from the request; any prices or totals it carries are ignored.
 */
export function priceOrder(raw: unknown): { order: Order } | { error: string } {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { error: "Expected an order" }
  const { lines: rawLines, parish } = raw as Record<string, unknown>

  const deliveryJMD = typeof parish === "string" ? getParishDeliveryFee(parish) : null
  if (deliveryJMD === null) return { error: "Unknown parish" }
  if (!Array.isArray(rawLines) || rawLines.length === 0) return { error: "The cart is empty" }
  if (rawLines.length > MAX_LINES) return { error: "Too many lines" }

  const lines: OrderLine[] = []
  for (const item of rawLines) {
    const { slug, sizeId, quantity } = (item ?? {}) as Record<string, unknown>
    const product = typeof slug === "string" ? getProduct(slug) : undefined
    if (!product) return { error: "Unknown product" }
    const size = product.sizes.find((s) => s.id === sizeId)
    if (!size) return { error: `Unknown size for ${product.name}` }
    if (!Number.isInteger(quantity) || (quantity as number) < 1 || (quantity as number) > MAX_QUANTITY)
      return { error: `Quantity must be a whole number from 1 to ${MAX_QUANTITY}` }
    if (lines.some((l) => l.slug === product.slug && l.sizeId === size.id)) return { error: "Repeated line" }

    const qty = quantity as number
    lines.push({
      slug: product.slug,
      sizeId: size.id,
      quantity: qty,
      name: product.name,
      sizeLabel: size.label,
      unitPriceJMD: size.priceJMD,
      lineTotalJMD: size.priceJMD * qty,
    })
  }

  const subtotalJMD = lines.reduce((sum, l) => sum + l.lineTotalJMD, 0)
  return {
    order: {
      id: newOrderId(),
      placedAt: new Date().toISOString(),
      parish: parish as Parish,
      lines,
      subtotalJMD,
      deliveryJMD,
      totalJMD: subtotalJMD + deliveryJMD,
    },
  }
}
