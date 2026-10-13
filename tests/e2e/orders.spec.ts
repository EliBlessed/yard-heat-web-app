import { test, expect } from "@playwright/test"

test.skip(({ isMobile }) => isMobile, "Covered by the desktop run")

const goodOrder = {
  lines: [
    { slug: "jerk-rub", sizeId: "250g", quantity: 2 },
    { slug: "escovitch", sizeId: "250ml", quantity: 1 },
  ],
  parish: "Kingston",
}

test("the order API prices the cart on the server and returns an order number", async ({ request }) => {
  const res = await request.post("/api/orders", { data: goodOrder })
  expect(res.status()).toBe(201)
  const order = await res.json()
  expect(order.id).toMatch(/^YH-[2-9A-HJ-NP-Z]{6}$/)
  expect(order.lines).toEqual([
    expect.objectContaining({ slug: "jerk-rub", sizeId: "250g", quantity: 2, unitPriceJMD: 1600, lineTotalJMD: 3200 }),
    expect.objectContaining({ slug: "escovitch", sizeId: "250ml", quantity: 1, unitPriceJMD: 1450, lineTotalJMD: 1450 }),
  ])
  expect(order).toMatchObject({ parish: "Kingston", subtotalJMD: 4650, deliveryJMD: 400, totalJMD: 5050 })
})

test("prices sent by the browser are ignored", async ({ request }) => {
  const tampered = {
    ...goodOrder,
    lines: [{ slug: "jerk-rub", sizeId: "250g", quantity: 1, priceJMD: 1, unitPriceJMD: 1 }],
    totalJMD: 1,
  }
  const order = await (await request.post("/api/orders", { data: tampered })).json()
  expect(order.lines[0].unitPriceJMD).toBe(1600)
  expect(order.totalJMD).toBe(2000)
})

const rejected: [string, unknown][] = [
  ["an unknown product", { ...goodOrder, lines: [{ slug: "ghost-pepper", sizeId: "150ml", quantity: 1 }] }],
  ["an unknown size", { ...goodOrder, lines: [{ slug: "escovitch", sizeId: "1l", quantity: 1 }] }],
  ["an unknown parish", { ...goodOrder, parish: "Atlantis" }],
  ["a parish that is a built-in object name", { ...goodOrder, parish: "constructor" }],
  ["a quantity over the cap", { ...goodOrder, lines: [{ slug: "escovitch", sizeId: "150ml", quantity: 11 }] }],
  ["a quantity below one", { ...goodOrder, lines: [{ slug: "escovitch", sizeId: "150ml", quantity: 0 }] }],
  ["a fractional quantity", { ...goodOrder, lines: [{ slug: "escovitch", sizeId: "150ml", quantity: 1.5 }] }],
  ["a repeated line", { ...goodOrder, lines: [goodOrder.lines[0], goodOrder.lines[0]] }],
  ["an empty cart", { ...goodOrder, lines: [] }],
  ["a body that isn't an order", ["not", "an", "order"]],
]
for (const [name, body] of rejected) {
  test(`the order API rejects ${name}`, async ({ request }) => {
    const res = await request.post("/api/orders", { data: body })
    expect(res.status()).toBe(400)
    expect((await res.json()).error).toBeTruthy()
  })
}

test("the order API rejects malformed and oversized bodies", async ({ request }) => {
  const headers = { "Content-Type": "application/json" }
  expect((await request.post("/api/orders", { headers, data: "{not json" })).status()).toBe(400)
  expect((await request.post("/api/orders", { headers, data: JSON.stringify({ ...goodOrder, pad: "x".repeat(20_000) }) })).status()).toBe(413)
  expect((await request.get("/api/orders")).status()).toBe(405)
})

test("a placed order opens a receipt page with its number, items and total", async ({ page }) => {
  await page.goto("/product/jerk-rub")
  await page.getByRole("button", { name: /Buy Now/ }).click()
  await page.getByLabel("Full name").fill("Test Customer")
  await page.getByLabel("Delivery address").fill("1 Test Road")
  await page.locator("#parish").click()
  await page.getByRole("option", { name: "Kingston", exact: true }).click()
  await page.getByRole("button", { name: "Place demo order" }).click()

  await expect(page).toHaveURL(/\/order\/YH-[2-9A-HJ-NP-Z]{6}$/)
  const id = page.url().split("/").pop()!
  await expect(page.getByRole("heading", { name: "Demo order placed" })).toBeVisible()
  await expect(page.getByText(id)).toBeVisible()
  await expect(page.getByText("Yard Jerk Dry Rub", { exact: true })).toBeVisible()
  await expect(page.getByText("J$2,000")).toBeVisible()
  await expect(page.getByText("Cook this first")).toBeVisible()
  // The cart empties, and the receipt survives a reload in the same tab.
  await expect(page.getByRole("link", { name: "Cart", exact: true })).toBeVisible()
  await page.reload()
  await expect(page.getByText(id)).toBeVisible()
})

test("an order number from another tab or device shows a friendly message", async ({ page }) => {
  await page.goto("/order/YH-ABCDEF")
  await expect(page.getByRole("heading", { name: "Receipt not on this device" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Browse the shop" })).toHaveAttribute("href", "/shop")
})
