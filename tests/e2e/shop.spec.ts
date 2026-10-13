import { test, expect, type Page } from "@playwright/test"

// Vercel Analytics only exists on Vercel, so its script 404s when the site runs locally.
const isVercelOnly = (url: string) => url.includes("/_vercel/")

// Collect script errors and failed requests so anything broken fails the test.
function trackErrors(page: Page) {
  const errors: string[] = []
  page.on("pageerror", (err) => errors.push(err.message))
  page.on("console", (msg) => {
    // Failed requests are checked below, where the URL is known.
    // With nosniff, the browser also refuses the local 404 for Vercel's analytics script: same Vercel-only gap.
    if (msg.type() === "error" && !msg.text().startsWith("Failed to load resource") && !isVercelOnly(msg.text()))
      errors.push(msg.text())
  })
  page.on("response", (res) => {
    if (res.status() >= 400 && !isVercelOnly(res.url())) errors.push(`${res.status()} ${res.url()}`)
  })
  return errors
}

async function chooseOption(page: Page, trigger: string, option: string) {
  await page.locator(trigger).click()
  await page.getByRole("option", { name: option, exact: true }).click()
}

test.beforeEach(async ({ page }) => {
  // Every test starts with an empty cart.
  await page.goto("/")
  await page.evaluate(() => localStorage.clear())
})

test("home page loads with hero, heat picker and working links", async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1, name: "Real yard heat, bottled bold." })).toBeVisible()
  await expect(page.getByAltText(/Bottle of Yard Heat pepper sauce/)).toBeVisible()

  // Heat picker: medium is selected by default, and every heat level fills a row of 3.
  const heat = page.getByRole("radiogroup", { name: "Heat level" })
  await expect(heat.getByRole("radio", { name: /Medium/ })).toHaveAttribute("aria-checked", "true")
  await expect(page.locator("#heat [data-testid=product-card]")).toHaveCount(3)
  await expect(page.locator("#heat").getByText("Escovitch Pepper Sauce")).toBeVisible()

  await heat.getByRole("radio", { name: /Gentle/ }).click()
  await expect(page.locator("#heat [data-testid=product-card]")).toHaveCount(3)
  await expect(page.locator("#heat").getByText("Pineapple Ginger Pepper Sauce")).toBeVisible()

  await heat.getByRole("radio", { name: /Hot/ }).click()
  await expect(page.locator("#heat [data-testid=product-card]")).toHaveCount(3)
  await expect(page.locator("#heat").getByText("Fire-Roasted Scotch Bonnet Sauce")).toBeVisible()
  await expect(page.locator("#heat").getByText("Scotch Bonnet Fire Rub")).toBeVisible()

  await page.getByRole("link", { name: "See every hot product in the shop" }).click()
  await expect(page).toHaveURL(/\/shop\?heat=hot/)
  await expect(page.getByTestId("product-card")).toHaveCount(3)
  expect(errors).toEqual([])
})

test("shop lists all nine products and filters by type and heat", async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto("/shop")
  await expect(page.getByTestId("product-card")).toHaveCount(9)
  await expect(page.getByText("Showing 9 of 9 products")).toBeVisible()

  await page.getByRole("radiogroup", { name: "Product type" }).getByRole("radio", { name: "Pepper sauces" }).click()
  await expect(page).toHaveURL(/type=sauce/)
  await expect(page.getByTestId("product-card")).toHaveCount(6)

  await page.getByRole("radiogroup", { name: "Product type" }).getByRole("radio", { name: "Spice rubs" }).click()
  await expect(page).toHaveURL(/type=rub/)
  await expect(page.getByTestId("product-card")).toHaveCount(3)

  await page.getByRole("radiogroup", { name: "Heat level" }).getByRole("radio", { name: "Hot" }).click()
  await expect(page.getByTestId("product-card")).toHaveCount(1)
  await expect(page.getByTestId("product-card")).toContainText("Scotch Bonnet Fire Rub")
  await page.getByRole("radiogroup", { name: "Product type" }).getByRole("radio", { name: "Everything" }).click()
  await page.getByRole("radiogroup", { name: "Heat level" }).getByRole("radio", { name: "Any heat" }).click()
  await expect(page.getByTestId("product-card")).toHaveCount(9)
  expect(errors).toEqual([])
})

test("product page: price follows the chosen size and related products show", async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto("/shop")
  await page.getByTestId("product-card").filter({ hasText: "Mango Scotch Bonnet Sauce" }).click()
  await expect(page).toHaveURL(/\/product\/mango-scotch-bonnet/)
  await expect(page.getByRole("heading", { level: 1, name: "Mango Scotch Bonnet Sauce" })).toBeVisible()

  // Default is the 250 ml bottle.
  await expect(page.getByTestId("product-price")).toHaveText("J$1,550")
  await page.getByText("150 ml", { exact: true }).click()
  await expect(page.getByTestId("product-price")).toHaveText("J$1,050")
  await page.getByText("500 ml", { exact: true }).click()
  await expect(page.getByTestId("product-price")).toHaveText("J$2,750")

  // Related row is always full: two more at medium heat plus a hot sauce.
  const related = page.locator("section").filter({ has: page.getByRole("heading", { name: "You might also like" }) })
  await expect(related.getByTestId("product-card")).toHaveCount(3)
  await expect(related).toContainText("Escovitch Pepper Sauce")
  await expect(related).toContainText("Fire-Roasted Scotch Bonnet Sauce")
  expect(errors).toEqual([])
})

test("every product page shows a full row of three related products", async ({ request, page }) => {
  for (const slug of ["pineapple-ginger", "escovitch", "fire-rub", "bbq-rub"]) {
    await page.goto(`/product/${slug}`)
    const related = page.locator("section").filter({ has: page.getByRole("heading", { name: "You might also like" }) })
    await expect(related.getByTestId("product-card")).toHaveCount(3)
  }
})

test("unknown product shows the branded not-found page", async ({ page }) => {
  const res = await page.goto("/product/does-not-exist")
  expect(res?.status()).toBe(404)
  await expect(page.getByRole("heading", { level: 1, name: "This bottle’s empty" })).toBeVisible()
  await page.getByRole("main").getByRole("button", { name: "Browse the shop" }).click()
  await expect(page).toHaveURL(/\/shop$/)
  await expect(page.getByRole("link", { name: "Shop", exact: true })).toHaveAttribute("aria-current", "page")
})

test("each product has its own share image", async ({ page, request }) => {
  await page.goto("/product/smoky-jerk")
  const og = await page.locator('meta[property="og:image"]').getAttribute("content")
  expect(og).toContain("/product/smoky-jerk/opengraph-image")
  const res = await request.get(new URL(og!).pathname)
  expect(res.status()).toBe(200)
  expect(res.headers()["content-type"]).toBe("image/png")
})

test("the shop is two columns on phones and three on desktop", async ({ page, isMobile }) => {
  await page.goto("/shop")
  const cards = page.getByTestId("product-card")
  // offsetTop ignores the rise-in animation's transform, so cards mid-animation still line up.
  const tops = await cards.evaluateAll((els) => els.slice(0, 3).map((el) => (el.parentElement as HTMLElement).offsetTop))
  // On a phone the third card starts a new row; on desktop all three share one.
  if (isMobile) expect(tops[2]).toBeGreaterThan(tops[0])
  else expect(new Set(tops).size).toBe(1)
})

test("cart: add, persist after reload, change quantity, remove", async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto("/product/smoky-jerk")
  await page.getByText("150 ml", { exact: true }).click()
  await chooseOption(page, "#smoky-jerk-quantity", "2")
  await page.getByRole("button", { name: /Add to cart/ }).click()
  // The drawer confirms what was added, then gets out of the way.
  const drawer = page.getByRole("dialog", { name: "Added to your cart" })
  await expect(drawer.getByText("150 ml · Travel bottle · Qty 2")).toBeVisible()
  await expect(drawer.getByText("Cart subtotal, 2 items")).toBeVisible()
  await drawer.getByRole("button", { name: "Keep browsing" }).click()
  await expect(drawer).toBeHidden()
  await expect(page.getByRole("link", { name: "Cart, 2 items" })).toBeVisible()

  // The cart survives a reload.
  await page.reload()
  await expect(page.getByRole("link", { name: "Cart, 2 items" })).toBeVisible()

  await page.getByRole("link", { name: "Cart, 2 items" }).click()
  await expect(page).toHaveURL(/\/cart/)
  await expect(page.getByText("Smoky Jerk Pepper Sauce")).toBeVisible()
  await expect(page.getByText("J$1,900").first()).toBeVisible() // 2 x J$950, line total and subtotal

  await page.getByRole("combobox", { name: /Quantity for Smoky Jerk/ }).click()
  await page.getByRole("option", { name: "3", exact: true }).click()
  await expect(page.getByText("J$2,850").first()).toBeVisible()
  await expect(page.getByRole("link", { name: "Cart, 3 items" })).toBeVisible()

  await page.getByRole("button", { name: /Remove Smoky Jerk Pepper Sauce/ }).click()
  await expect(page.getByText(/Your cart is empty/)).toBeVisible()
  expect(errors).toEqual([])
})

test("checkout: parish delivery fee, demo order, cart empties", async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto("/product/jerk-rub")
  await page.getByRole("button", { name: /Buy Now/ }).click()
  await expect(page).toHaveURL(/\/checkout/)
  await expect(page.getByText("Select a parish to see delivery")).toBeVisible()

  await page.getByLabel("Full name").fill("Test Customer")
  await page.getByLabel("Delivery address").fill("1 Test Road")
  await chooseOption(page, "#parish", "Kingston")
  await expect(page.getByText("J$400", { exact: true })).toBeVisible()
  await expect(page.getByText("J$2,000")).toBeVisible() // J$1,600 large jar + J$400

  await chooseOption(page, "#parish", "Hanover")
  await expect(page.getByText("J$3,500", { exact: true })).toBeVisible()
  await expect(page.getByText("J$5,100")).toBeVisible()

  await page.getByRole("button", { name: "Place demo order" }).click()
  await expect(page.getByText("Demo order placed")).toBeVisible()
  await expect(page.getByText(/No payment was taken/)).toBeVisible()
  await expect(page.getByRole("button", { name: "Keep shopping" })).toHaveAttribute("href", "/shop")
  await expect(page.getByRole("link", { name: "Cart", exact: true })).toBeVisible()
  expect(errors).toEqual([])
})

test("empty cart sends checkout back to the cart page", async ({ page }) => {
  await page.goto("/checkout")
  await expect(page).toHaveURL(/\/cart/)
  await expect(page.getByText("Browse the shop")).toBeVisible()
})

test("no page scrolls sideways on a phone-sized screen", async ({ page }) => {
  for (const path of ["/", "/shop", "/product/guava-bbq", "/cart", "/about", "/contact", "/privacy"]) {
    await page.goto(path)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow, `${path} overflows by ${overflow}px`).toBeLessThanOrEqual(1)
  }
})

test("keyboard users can skip to the main content", async ({ page }) => {
  await page.goto("/shop")
  await page.keyboard.press("Tab")
  const skip = page.getByRole("link", { name: "Skip to content" })
  await expect(skip).toBeFocused()
  await skip.press("Enter")
  await expect(page).toHaveURL(/#main$/)
})

test("product page lists serving ideas", async ({ page }) => {
  await page.goto("/product/guava-bbq")
  await expect(page.getByRole("heading", { name: "Try it on" })).toBeVisible()
  await expect(page.getByText("As a glaze for baked ham")).toBeVisible()
})

test("adding to cart plays the fly-to-cart animation and cleans up after it", async ({ page }) => {
  await page.goto("/product/guava-bbq")
  await page.getByRole("button", { name: /Add to cart/ }).click()
  // The flying copy of the photo appears, then is removed when it lands.
  await expect(page.locator("body > img[aria-hidden=true]")).toHaveCount(1)
  await expect(page.locator("body > img[aria-hidden=true]")).toHaveCount(0, { timeout: 3000 })
  // It lands, then the drawer slides in; Escape closes it.
  const drawer = page.getByRole("dialog", { name: "Added to your cart" })
  await expect(drawer.getByText("Guava Scotch Bonnet Barbecue Sauce")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(drawer).toBeHidden()
  await expect(page.getByRole("link", { name: "Cart, 1 item" })).toBeVisible()
})

test("the cart drawer goes straight to checkout", async ({ page }) => {
  await page.goto("/product/escovitch")
  await page.getByRole("button", { name: /Add to cart/ }).click()
  await page.getByRole("dialog", { name: "Added to your cart" }).getByRole("button", { name: "Checkout" }).click()
  await expect(page).toHaveURL(/\/checkout/)
  await expect(page.getByText("Escovitch Pepper Sauce")).toBeVisible()
})

test("on a phone, a buy bar stays on screen while the main buttons are out of view", async ({ page, isMobile }) => {
  test.skip(!isMobile, "The bar is phone-only")
  await page.goto("/product/smoky-jerk")
  const bar = page.getByTestId("sticky-buy-bar")
  // The main buttons start below the fold, so the bar is there from the start.
  await expect(bar).toHaveAttribute("aria-hidden", "false")
  await page.getByTestId("product-price").scrollIntoViewIfNeeded()
  await expect(bar).toHaveAttribute("aria-hidden", "true")
  await page.evaluate(() => scrollTo(0, 0))
  await bar.getByRole("button", { name: "Add 250 ml" }).click()
  await expect(page.getByRole("dialog", { name: "Added to your cart" })).toBeVisible()
})

test("leaving a product page works when an extension has patched scrollTo", async ({ page }) => {
  // Some browser extensions wrap window.scrollTo and return a value; an effect that passes that value
  // back to React makes it crash with "is not a function" when the page unmounts.
  await page.addInitScript(() => {
    const original = window.scrollTo.bind(window) as (...args: unknown[]) => void
    window.scrollTo = ((...args: unknown[]) => (original(...args), Promise.resolve())) as unknown as typeof window.scrollTo
  })
  const errors = trackErrors(page)
  await page.goto("/product/escovitch")
  await page.getByRole("banner").getByRole("link", { name: "Shop", exact: true }).click()
  await expect(page.getByRole("heading", { level: 1, name: "Shop" })).toBeVisible()
  expect(errors).toEqual([])
})

test("opening a product from the shop runs a view transition", async ({ page }) => {
  await page.goto("/shop")
  // Count view transitions the browser is asked to run.
  await page.evaluate(() => {
    const w = window as Window & { transitions?: number }
    w.transitions = 0
    const start = document.startViewTransition.bind(document)
    document.startViewTransition = ((arg: Parameters<typeof start>[0]) => {
      w.transitions!++
      return start(arg)
    }) as typeof document.startViewTransition
  })
  await page.locator('a[href="/product/escovitch"]').click()
  await expect(page.getByRole("heading", { level: 1, name: "Escovitch Pepper Sauce" })).toBeVisible()
  expect(await page.evaluate(() => (window as Window & { transitions?: number }).transitions)).toBeGreaterThan(0)
})

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" })

  test("everything is visible straight away and nothing flies", async ({ page }) => {
    await page.goto("/")
    // No entrance animation: the headline and photo are in place on first paint.
    await expect(page.getByRole("heading", { level: 1 })).toBeInViewport()
    const clip = await page.getByTestId("hero-arch").evaluate((el) => getComputedStyle(el).clipPath)
    expect(clip).not.toContain("100%")

    await page.goto("/product/guava-bbq")
    await page.getByRole("button", { name: /Add to cart/ }).click()
    await expect(page.locator("body > img[aria-hidden=true]")).toHaveCount(0)
    // No flight to wait for: the drawer opens at once.
    await expect(page.getByRole("dialog", { name: "Added to your cart" })).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(page.getByRole("link", { name: "Cart, 1 item" })).toBeVisible()
  })
})

test("every photo is compressed for fast loading", async ({ page }) => {
  const sizes: { url: string; bytes: number }[] = []
  page.on("response", async (res) => {
    if (res.request().resourceType() === "image" && res.ok()) {
      const body = await res.body().catch(() => null)
      if (body) sizes.push({ url: res.url(), bytes: body.length })
    }
  })
  for (const path of ["/", "/shop"]) await page.goto(path, { waitUntil: "networkidle" })
  expect(sizes.length).toBeGreaterThan(0)
  for (const { url, bytes } of sizes) expect(bytes, `${url} is ${Math.round(bytes / 1024)} KB`).toBeLessThan(250 * 1024)
})
