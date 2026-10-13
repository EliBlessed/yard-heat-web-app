import { test, expect } from "@playwright/test"
import { statSync } from "node:fs"

const heroVideos = ["/yard-heat-hero.webm", "/yard-heat-hero.mp4"]
const isHeroVideo = (url: string) => heroVideos.some((v) => url.endsWith(v))

test("each hero video file stays under 1.5 MB", async () => {
  for (const file of heroVideos) expect(statSync(`public${file}`).size, file).toBeLessThan(1.5 * 1024 * 1024)
})

test("hero video plays muted on wide screens and only the photo loads on phones", async ({ page, isMobile }) => {
  const videoRequests: string[] = []
  page.on("request", (req) => {
    if (isHeroVideo(req.url())) videoRequests.push(req.url())
  })
  await page.goto("/")
  // The photo is always there underneath, carrying the alt text.
  await expect(page.getByAltText(/Bottle of Yard Heat pepper sauce/)).toBeVisible()

  const video = page.getByTestId("hero-video")
  if (isMobile) {
    await expect(video).toHaveCount(0)
    expect(videoRequests).toEqual([])
    return
  }

  await expect(video).toHaveCSS("opacity", "1", { timeout: 10_000 })
  const state = await video.evaluate((el: HTMLVideoElement) => ({ muted: el.muted, loop: el.loop, paused: el.paused }))
  expect(state).toEqual({ muted: true, loop: true, paused: false })
  // Only one of the two formats is downloaded.
  expect(new Set(videoRequests).size).toBe(1)
  const start = await video.evaluate((el: HTMLVideoElement) => el.currentTime)
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeGreaterThan(start)
})

test("the heat slider lights flames, warms the panel and reshuffles three products", async ({ page }) => {
  await page.goto("/")
  const slider = page.getByRole("slider", { name: "Heat level" })
  const panel = page.getByTestId("heat-panel")
  const cards = page.locator("#heat [data-testid=product-card]")
  const colours: string[] = []
  for (const [level, band] of [["5", "Hot"], ["1", "Gentle"], ["3", "Medium"]]) {
    await slider.fill(level)
    await expect(slider).toHaveAttribute("aria-valuetext", new RegExp(`${level} of 5 flames, ${band}`))
    await expect(page.locator("#heat .heat-flicker")).toHaveCount(Number(level))
    // Old cards fade out first, so wait until all three belong to the new heat level.
    await expect(cards.filter({ hasText: band })).toHaveCount(3)
    await expect(cards).toHaveCount(3)
    await expect.poll(() => panel.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe(colours.at(-1))
    colours.push(await panel.evaluate((el) => getComputedStyle(el).backgroundColor))
  }
  // Keyboard works too.
  await slider.focus()
  await page.keyboard.press("ArrowRight")
  await expect(slider).toHaveValue("4")
})

test("the fire-to-bottle story swaps the pinned photo as each step scrolls past", async ({ page, isMobile }) => {
  await page.goto("/")
  const steps = page.locator("ol[data-active-step] > li")
  await expect(steps).toHaveCount(3)
  if (isMobile) {
    // Phones get each photo with its own step instead of a pinned one.
    for (const name of ["roast", "simmer", "bottle"]) {
      const img = steps.locator(`img[src*="process-${name}"]`)
      await img.scrollIntoViewIfNeeded()
      await expect(img).toBeVisible()
    }
    return
  }
  for (const [i, name] of ["roast", "simmer", "bottle"].entries()) {
    await steps.nth(i).evaluate((el) => el.scrollIntoView({ block: "center" }))
    await expect(page.locator("ol[data-active-step]")).toHaveAttribute("data-active-step", String(i))
    await expect(page.getByRole("img", { name: /./ }).and(page.locator(`img[src*="process-${name}"]`))).toBeInViewport()
  }
})

test("product cards rise into view and their heat meters fill", async ({ page }) => {
  await page.goto("/shop")
  const cards = page.getByTestId("product-card")
  await expect(cards).toHaveCount(9)
  const last = cards.last()
  await last.scrollIntoViewIfNeeded()
  // Once in view, the card has finished rising: fully opaque, no leftover offset.
  await expect(page.getByTestId("rise-in").last()).toHaveCSS("opacity", "1")
  await expect(page.getByTestId("rise-in").last()).toHaveCSS("transform", "none")
  const flames = last.getByRole("img", { name: /Heat level \d out of 5/ }).locator("span")
  await expect(flames.first()).toHaveCSS("opacity", "1")
})

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" })

  test("the hero stays a still photo and cards appear without animation", async ({ page }) => {
    const videoRequests: string[] = []
    page.on("request", (req) => {
      if (isHeroVideo(req.url())) videoRequests.push(req.url())
    })
    await page.goto("/")
    await expect(page.getByAltText(/Bottle of Yard Heat pepper sauce/)).toBeVisible()
    await expect(page.getByTestId("hero-video")).toHaveCount(0)
    expect(videoRequests).toEqual([])

    await page.goto("/shop")
    await expect(page.getByTestId("rise-in")).toHaveCount(0)
    await expect(page.getByTestId("product-card").first()).toBeVisible()
  })

  test("the heat slider changes products instantly and the flames stay still", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("slider", { name: "Heat level" }).fill("5")
    await expect(page.locator("#heat [data-testid=product-card]").filter({ hasText: "Hot" })).toHaveCount(3)
    const animations = await page.locator("#heat .heat-flicker").evaluateAll((els) => els.map((el) => getComputedStyle(el).animationName))
    expect(animations).toEqual(Array(5).fill("none"))
  })
})
