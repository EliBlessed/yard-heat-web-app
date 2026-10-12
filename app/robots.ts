import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    // The cart and checkout only make sense in a visitor's own browser.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/cart", "/checkout"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}
