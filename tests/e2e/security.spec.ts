import { test, expect } from "@playwright/test"

test.skip(({ isMobile }) => isMobile, "Covered by the desktop run")

const expectedHeaders = {
  "x-frame-options": "DENY",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
}

test("pages, Markdown versions and files all send the security headers", async ({ request }) => {
  const cases = [
    { path: "/", accept: "text/html" },
    { path: "/product/escovitch", accept: "text/markdown" },
    { path: "/llms.txt", accept: "*/*" },
    { path: "/yard-heat-hero.webp", accept: "*/*" },
  ]
  for (const { path, accept } of cases) {
    const res = await request.get(path, { headers: { Accept: accept } })
    expect(res.status(), path).toBe(200)
    const headers = res.headers()
    for (const [name, value] of Object.entries(expectedHeaders)) expect(headers[name], `${name} on ${path}`).toBe(value)
    expect(headers["permissions-policy"], path).toContain("camera=()")
    // Scripts, styles and requests may only come from this site, and no other site may frame it.
    for (const rule of ["default-src 'self'", "script-src 'self'", "object-src 'none'", "frame-ancestors 'none'"])
      expect(headers["content-security-policy"], path).toContain(rule)
  }
})

test("a malformed URL gets a 400, not a server error", async ({ request }) => {
  for (const accept of ["text/html", "text/markdown"]) {
    const res = await request.get("/product/%E0%A4%A", { headers: { Accept: accept } })
    expect(res.status(), accept).toBe(400)
  }
})

test("checkout details never reach the page address that analytics records", async ({ page }) => {
  await page.goto("/product/guava-bbq")
  await page.getByRole("button", { name: /Add to cart/ }).click()
  await page.goto("/checkout")
  const urls: string[] = []
  page.on("framenavigated", (frame) => urls.push(frame.url()))
  await page.getByLabel("Full name").fill("Privacy Test Name")
  await page.getByLabel("Delivery address").fill("42 Secret Lane")
  await page.locator("#parish").click()
  await page.getByRole("option", { name: "Kingston", exact: true }).click()
  await page.getByRole("button", { name: "Place demo order" }).click()
  await expect(page.getByText("Demo order placed")).toBeVisible()
  urls.push(page.url())
  for (const url of urls) expect(url).not.toMatch(/Privacy|Secret|name=|address=/i)
})
