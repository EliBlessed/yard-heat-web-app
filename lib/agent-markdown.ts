// Plain Markdown versions of each page, served to AI agents that ask for text/markdown.
// Everything is built from the same product data the pages use, so the two can never disagree.
import {
  formatJMD,
  getCategory,
  getHeatBand,
  getLowestDeliveryFee,
  getLowestPrice,
  getProduct,
  heatBands,
  parishDeliveryFees,
  products,
  servingIdeas,
  type Product,
} from "@/lib/product"
import { ORIGINAL_SITE_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOURCE_URL, absoluteUrl } from "@/lib/site"

export type MarkdownPage = { status: number; body: string }

const demoNote =
  "> Yard Heat is a fictional brand and this is a demo shop. No payments are taken and no orders are shipped."

const productLine = (p: Product) =>
  `- [${p.name}](${absoluteUrl(`/product/${p.slug}`)}): ${getCategory(p) === "rub" ? "spice rub" : "pepper sauce"}, heat ${p.heatLevel} of ${p.maxHeat} (${getHeatBand(p.heatLevel).name}), from ${formatJMD(getLowestPrice(p))}`

const footer = [
  "## More",
  `- [All products](${absoluteUrl("/shop")})`,
  `- [About Yard Heat](${absoluteUrl("/about")})`,
  `- [Guide for AI agents (llms.txt)](${absoluteUrl("/llms.txt")})`,
  `- [Sitemap](${absoluteUrl("/sitemap.xml")})`,
].join("\n")

const page = (lines: string[]) => ({ status: 200, body: `${lines.join("\n\n")}\n` })

function home(): MarkdownPage {
  return page([
    `# ${SITE_NAME}: Small-batch Jamaican pepper sauces and spice rubs`,
    demoNote,
    SITE_DESCRIPTION,
    "## Products",
    products.map(productLine).join("\n"),
    "## Heat levels",
    heatBands.map((b) => `- **${b.name}**: ${b.description}`).join("\n"),
    "## How it's made",
    [
      "1. **Roast**: whole Scotch bonnets go over open flame until the skins blister.",
      "2. **Simmer**: the peppers cook down slowly with pimento, scallion and thyme.",
      "3. **Bottle**: each batch is bottled hot in Kingston and labelled by hand.",
    ].join("\n"),
    "## Delivery",
    `Delivery is priced by parish, from ${formatJMD(getLowestDeliveryFee())} in Kingston, St. Andrew and St. Catherine to ${formatJMD(Math.max(...Object.values(parishDeliveryFees)))} in Westmoreland and Hanover. One fee per order.`,
    footer,
  ])
}

function shop(): MarkdownPage {
  return page([
    "# Shop: all Yard Heat products",
    demoNote,
    "Six pepper sauces and three dry rubs, all built on Jamaican Scotch bonnet. Prices are in Jamaican dollars (JMD).",
    "## Pepper sauces",
    products.filter((p) => getCategory(p) === "sauce").map(productLine).join("\n"),
    "## Spice rubs",
    products.filter((p) => getCategory(p) === "rub").map(productLine).join("\n"),
    `Filter in the browser with \`?type=sauce|rub\` and \`?heat=${heatBands.map((b) => b.id).join("|")}\`, for example ${absoluteUrl("/shop?heat=hot")}.`,
    footer,
  ])
}

function product(p: Product): MarkdownPage {
  return page([
    `# ${p.name}`,
    demoNote,
    p.description,
    `- **Type:** ${getCategory(p) === "rub" ? "Spice rub" : "Pepper sauce"}\n- **Heat:** ${p.heatLevel} of ${p.maxHeat} (${getHeatBand(p.heatLevel).name})`,
    `## ${p.sizeHeading}s and prices (JMD)`,
    p.sizes.map((s) => `- ${s.label}: ${formatJMD(s.priceJMD)}`).join("\n"),
    "## Try it on",
    (servingIdeas[p.slug] ?? []).map((idea) => `- ${idea}`).join("\n"),
    footer,
  ])
}

function about(): MarkdownPage {
  return page([
    "# About Yard Heat",
    demoNote,
    `Yard Heat is a portfolio project by Elijah Johnson: a working demo of an online shop for a fictional Jamaican pepper sauce brand. It started as a NextWork guided project and grew into a nine-product shop with a cart, delivery fees by parish, motion, and automated Playwright tests. The original version is still online at ${ORIGINAL_SITE_URL}.`,
    `Source code: ${SOURCE_URL}`,
    footer,
  ])
}

function contact(): MarkdownPage {
  return page([
    "# Contact",
    demoNote,
    "Yard Heat has no customer service team, because it isn't a real business. For questions about the project itself, contact Elijah Johnson through LinkedIn or open an issue on GitHub.",
    "- LinkedIn: https://www.linkedin.com/in/elijah-johnson-data-ai",
    `- GitHub: ${SOURCE_URL}/issues`,
    footer,
  ])
}

function privacy(): MarkdownPage {
  return page([
    "# Privacy",
    demoNote,
    "- **Cart:** stored only in your own browser (localStorage) until a demo order is placed, along with the parish if you pick one on the home page map.",
    "- **Checkout:** placing a demo order sends only the items and parish to the shop, which checks the prices and returns an order number. Nothing is stored on the server; the name and address never leave the browser. No payment details are asked for.",
    "- **Analytics:** Vercel Web Analytics counts page views without cookies.",
    "- **No accounts, no marketing emails, no data sold or shared.**",
    footer,
  ])
}

function cartLike(title: string): MarkdownPage {
  return page([
    `# ${title}`,
    demoNote,
    "The cart and checkout run in the visitor's browser, so there is nothing to show without one. Browse products instead:",
    products.map(productLine).join("\n"),
    footer,
  ])
}

export function notFoundMarkdown(path: string): MarkdownPage {
  return {
    status: 404,
    body: [
      "# 404: Page not found",
      `There is no page at \`${path}\` on ${SITE_NAME} (${SITE_URL}).`,
      "Try one of these instead:",
      `- [Home](${absoluteUrl("/")})\n- [All products](${absoluteUrl("/shop")})\n- [Guide for AI agents (llms.txt)](${absoluteUrl("/llms.txt")})\n- [Sitemap](${absoluteUrl("/sitemap.xml")})`,
    ].join("\n\n") + "\n",
  }
}

/** Markdown for a path, or a Markdown 404 when no such page exists. */
export function markdownFor(pathname: string): MarkdownPage {
  const path = pathname.replace(/\/+$/, "") || "/"
  if (path === "/") return home()
  if (path === "/shop" || path === "/product") return shop()
  if (path === "/about") return about()
  if (path === "/contact") return contact()
  if (path === "/privacy") return privacy()
  if (path === "/cart") return cartLike("Cart")
  if (path === "/checkout") return cartLike("Demo checkout")
  const match = path.match(/^\/product\/([^/]+)$/)
  if (match) {
    const p = getProduct(decodeURIComponent(match[1]))
    if (p) return product(p)
  }
  return notFoundMarkdown(path)
}

/** True when the client prefers Markdown over HTML, using the q-values in the Accept header. */
export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false
  let md = 0
  let html = 0
  for (const part of accept.split(",")) {
    const [type, ...params] = part.trim().toLowerCase().split(";")
    const qParam = params.map((p) => p.trim()).find((p) => p.startsWith("q="))
    const q = qParam ? Number.parseFloat(qParam.slice(2)) : 1
    if (Number.isNaN(q)) continue
    if (type === "text/markdown" || type === "text/x-markdown") md = Math.max(md, q)
    if (type === "text/html") html = Math.max(html, q)
  }
  return md > 0 && md >= html
}
