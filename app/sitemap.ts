import type { MetadataRoute } from "next"
import { products } from "@/lib/product"
import { absoluteUrl } from "@/lib/site"

// Last time the shop's content changed. Update it when products or pages change.
const LAST_UPDATED = new Date("2026-10-11")

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/shop", "/about", "/contact", "/privacy"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: LAST_UPDATED,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.6,
  }))
  const productPages = products.map((p) => ({
    url: absoluteUrl(`/product/${p.slug}`),
    lastModified: LAST_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))
  return [...pages, ...productPages]
}
