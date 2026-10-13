import { NextResponse } from "next/server"
import { priceOrder } from "@/lib/order"

/** A full cart is well under 4 KB, so anything far bigger is refused before it is parsed. */
const MAX_BODY_BYTES = 16_000

export async function POST(request: Request) {
  const tooLarge = () => NextResponse.json({ error: "Order too large" }, { status: 413 })
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) return tooLarge()
  const text = await request.text()
  if (text.length > MAX_BODY_BYTES) return tooLarge()

  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    return NextResponse.json({ error: "Expected JSON" }, { status: 400 })
  }

  const result = priceOrder(body)
  if ("error" in result) return NextResponse.json(result, { status: 400 })
  // Nothing is stored: the order goes back to the browser, which keeps it for the receipt page.
  return NextResponse.json(result.order, { status: 201, headers: { "Cache-Control": "no-store" } })
}
