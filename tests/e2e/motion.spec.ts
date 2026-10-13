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

test("switching heat level slides the pill and swaps in three products", async ({ page }) => {
  await page.goto("/")
  const heat = page.getByRole("radiogroup", { name: "Heat level" })
  for (const level of ["Hot", "Gentle", "Medium"]) {
    await heat.getByRole("radio", { name: new RegExp(level) }).click()
    await expect(heat.getByRole("radio", { name: new RegExp(level) })).toHaveAttribute("aria-checked", "true")
    // The old row fades out first, so wait until all three cards belong to the new heat level.
    const cards = page.locator("#heat [data-testid=product-card]")
    await expect(cards.filter({ hasText: level })).toHaveCount(3)
    await expect(cards).toHaveCount(3)
    await cards.first().scrollIntoViewIfNeeded()
    await expect(cards.first()).toBeVisible()
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
})
