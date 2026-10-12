import { test, expect } from "@playwright/test"
import { products } from "../../lib/product"

// Machine-readable files and Markdown responses don't depend on screen size, so run them once.
test.skip(({ isMobile }) => isMobile, "Covered by the desktop run")

const MD = { Accept: "text/markdown" }

test.describe("Markdown content negotiation", () => {
  test("homepage returns Markdown with Vary: Accept when asked for text/markdown", async ({ request }) => {
    const res = await request.get("/", { headers: MD })
    expect(res.status()).toBe(200)
    expect(res.headers()["content-type"]).toContain("text/markdown")
    expect(res.headers()["vary"]).toContain("Accept")
    const body = await res.text()
    expect(body).toMatch(/^# Yard Heat/)
    for (const p of products) expect(body).toContain(p.name)
  })

  test("homepage still returns HTML for browsers", async ({ request }) => {
    const res = await request.get("/", { headers: { Accept: "text/html,application/xhtml+xml,*/*;q=0.8" } })
    expect(res.status()).toBe(200)
    expect(res.headers()["content-type"]).toContain("text/html")
    expect(await res.text()).toContain("<h1")
  })

  test("HTML wins when the client prefers it", async ({ request }) => {
    const res = await request.get("/", { headers: { Accept: "text/html, text/markdown;q=0.5" } })
    expect(res.headers()["content-type"]).toContain("text/html")
  })

  test("product, shop and info pages have Markdown versions", async ({ request }) => {
    const product = await request.get("/product/mango-scotch-bonnet", { headers: MD })
    expect(product.status()).toBe(200)
    const text = await product.text()
    expect(text).toContain("# Mango Scotch Bonnet Sauce")
    expect(text).toContain("J$1,550")
    for (const path of ["/shop", "/about", "/contact", "/privacy", "/cart", "/checkout"]) {
      const res = await request.get(path, { headers: MD })
      expect(res.status(), path).toBe(200)
      expect(res.headers()["content-type"], path).toContain("text/markdown")
    }
  })
})

test.describe("Agent-friendly 404s", () => {
  test("unknown paths return 404 with a Markdown body for agents", async ({ request }) => {
    const res = await request.get("/this-page-does-not-exist", { headers: MD })
    expect(res.status()).toBe(404)
    expect(res.headers()["content-type"]).toContain("text/markdown")
    const body = await res.text()
    expect(body.length).toBeGreaterThan(20)
    expect(body).toContain("/llms.txt")
    expect(body).toContain("/sitemap.xml")
  })

  test("unknown products return a Markdown 404 too", async ({ request }) => {
    const res = await request.get("/product/does-not-exist", { headers: MD })
    expect(res.status()).toBe(404)
  })

  test("browsers still get the HTML 404 page", async ({ request }) => {
    const res = await request.get("/this-page-does-not-exist", { headers: { Accept: "text/html" } })
    expect(res.status()).toBe(404)
    expect(res.headers()["content-type"]).toContain("text/html")
  })
})

test.describe("Machine-readable files", () => {
  test("sitemap.xml lists every indexable page and product with lastmod", async ({ request }) => {
    const res = await request.get("/sitemap.xml")
    expect(res.status()).toBe(200)
    expect(res.headers()["content-type"]).toContain("xml")
    const xml = await res.text()
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
    expect(xml).toContain("<lastmod>")
    for (const path of ["/shop", "/about", "/contact", "/privacy"]) expect(xml).toContain(`yard-heat-v2.vercel.app${path}<`)
    for (const p of products) expect(xml).toContain(`/product/${p.slug}<`)
    expect(xml).not.toContain("/checkout")
  })

  test("robots.txt points to the sitemap", async ({ request }) => {
    const text = await (await request.get("/robots.txt")).text()
    expect(text).toContain("Sitemap: https://yard-heat-v2.vercel.app/sitemap.xml")
    expect(text).toContain("Disallow: /checkout")
  })

  test("llms.txt follows the format and says when to use the site", async ({ request }) => {
    const res = await request.get("/llms.txt")
    expect(res.status()).toBe(200)
    expect(res.headers()["content-type"]).toContain("text/plain")
    const text = await res.text()
    expect(text).toMatch(/^# Yard Heat\n\n> /)
    expect(text).toContain("## When to use this site")
    expect(text).toContain("Do not use it to buy real products")
    for (const p of products) expect(text).toContain(`/product/${p.slug}`)
  })
})

test.describe("Homepage metadata and structured data", () => {
  test("has canonical, language, Open Graph type and image", async ({ page, request }) => {
    await page.goto("/")
    await expect(page.locator("html")).toHaveAttribute("lang", "en")
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://yard-heat-v2.vercel.app")
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website")
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content")
    expect(ogImage).toBe("https://yard-heat-v2.vercel.app/og-image.jpg")
    const img = await request.get("/og-image.jpg")
    expect(img.status()).toBe(200)
    expect(img.headers()["content-type"]).toBe("image/jpeg")
  })

  test("each page has its own canonical URL", async ({ page }) => {
    for (const path of ["/shop", "/about", "/product/smoky-jerk"]) {
      await page.goto(path)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://yard-heat-v2.vercel.app${path}`)
    }
  })

  test("JSON-LD describes the store and its products honestly", async ({ page }) => {
    await page.goto("/")
    const raw = await page.locator('script[type="application/ld+json"]').textContent()
    const data = JSON.parse(raw ?? "{}")
    const graph = data["@graph"] as Array<Record<string, unknown>>
    const store = graph.find((n) => n["@type"] === "OnlineStore")
    expect(store?.name).toBe("Yard Heat")
    expect(store?.url).toBe("https://yard-heat-v2.vercel.app")
    expect(String(store?.description)).toContain("demo")
    // A fictional shop must not publish a made-up address or phone number.
    expect(store).not.toHaveProperty("address")
    expect(store).not.toHaveProperty("telephone")
    const list = graph.find((n) => n["@type"] === "ItemList") as { itemListElement: unknown[] }
    expect(list.itemListElement).toHaveLength(products.length)
  })

  test("homepage content is in the raw HTML, before any JavaScript runs", async ({ request }) => {
    const html = await (await request.get("/", { headers: { Accept: "text/html" } })).text()
    const text = html
      .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
    expect(text.length).toBeGreaterThan(500)
    expect(html).toContain("Real yard heat")
    expect(html).toContain("Good to know")
  })
})

test.describe("Trust pages", () => {
  for (const [path, heading] of [
    ["/about", "About Yard Heat"],
    ["/contact", "Contact"],
    ["/privacy", "Privacy"],
  ] as const) {
    test(`${path} has real content and is linked from the footer`, async ({ page }) => {
      await page.goto(path)
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible()
      const main = (await page.locator("main").innerText()).replace(/\s+/g, " ")
      expect(main.length).toBeGreaterThan(500)
      await expect(page.locator("footer").getByRole("link", { name: heading.replace("About Yard Heat", "About") })).toHaveAttribute("href", path)
    })
  }
})
