import { test, expect, type Page } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

// Reduced motion so axe checks the settled page, not a card halfway through fading in.
test.use({ reducedMotion: "reduce" })

const pages = ["/", "/shop", "/product/escovitch", "/cart", "/checkout", "/about", "/contact", "/privacy", "/no-such-page"]

async function withItemInCart(page: Page) {
  await page.goto("/product/escovitch")
  await page.getByRole("button", { name: /Add to cart/ }).click()
}

test("every page has zero axe accessibility issues", async ({ page }) => {
  await withItemInCart(page)
  for (const path of pages) {
    await page.goto(path)
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze()
    const summary = violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)
    expect(summary, path).toEqual([])
  }
})

test("buttons and controls are at least 40 px tall and wide", async ({ page }) => {
  await withItemInCart(page)
  const report: Record<string, string[]> = {}
  for (const path of pages) {
    await page.goto(path)
    const small = await page
      .locator("button, [role=radio]:not(label [role=radio]), [role=combobox], input, select, textarea, a:not(p a):not(li a)")
      .evaluateAll((els) =>
        els
          .filter((el) => (el as HTMLElement).offsetParent !== null)
          .map((el) => ({ el, r: el.getBoundingClientRect() }))
          .filter(({ r }) => r.width > 0 && (r.width < 40 || r.height < 40))
          .map(({ el, r }) => `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}" ${Math.round(r.width)}x${Math.round(r.height)}`),
      )
    if (small.length) report[path] = small
  }
  expect(report).toEqual({})
})

test("the order receipt has zero axe accessibility issues", async ({ page }) => {
  await withItemInCart(page)
  await page.goto("/checkout")
  await page.getByLabel("Full name").fill("Axe Test")
  await page.getByLabel("Delivery address").fill("1 Test Road")
  await page.locator("#parish").click()
  await page.getByRole("option", { name: "Kingston", exact: true }).click()
  await page.getByRole("button", { name: "Place demo order" }).click()
  await expect(page.getByRole("heading", { name: "Demo order placed" })).toBeVisible()
  for (const url of [page.url(), "/order/YH-ABCDEF"]) {
    await page.goto(url)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze()
    expect(violations.map((v) => v.id), url).toEqual([])
  }
})
