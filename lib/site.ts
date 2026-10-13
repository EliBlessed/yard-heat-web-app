// One place for the public address and the facts every machine-readable file repeats.
export const SITE_URL = "https://yard-heat-v2.vercel.app"
export const SITE_NAME = "Yard Heat"
export const SITE_TAGLINE = "Small-batch Jamaican pepper sauces and spice rubs"
export const SITE_DESCRIPTION =
  "Yard Heat is a demo online shop for a fictional brand of small-batch Jamaican pepper sauces and spice rubs made with Scotch bonnet. Browse nine products by heat level, add them to a cart and try a demo checkout with delivery priced by parish. No payments are taken and no orders are shipped."
export const SOURCE_URL = "https://github.com/EliBlessed/yard-heat-web-app"
export const OWNER_NAME = "Elijah Johnson"
export const OWNER_LINKEDIN = "https://www.linkedin.com/in/elijah-johnson-data-ai"
export const ORIGINAL_SITE_URL = "https://v0-yard-heat.vercel.app"

/** Pages that exist, with the title used in the sitemap, llms.txt and Markdown views. */
export const staticPages = [
  { path: "/", title: "Home" },
  { path: "/shop", title: "Shop" },
  { path: "/about", title: "About Yard Heat" },
  { path: "/contact", title: "Contact" },
  { path: "/privacy", title: "Privacy" },
  { path: "/cart", title: "Cart" },
  { path: "/checkout", title: "Demo checkout" },
] as const

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString()
