import { formatJMD, getCategory, getHeatBand, getLowestPrice, heatBands, products } from "@/lib/product"
import { ORIGINAL_SITE_URL, SITE_DESCRIPTION, SITE_URL, SOURCE_URL, absoluteUrl } from "@/lib/site"

// llms.txt (https://llmstxt.org): an H1, a one-line summary in a blockquote, then sections of links.
export const dynamic = "force-static"

export function GET() {
  const productLinks = products
    .map(
      (p) =>
        `- [${p.name}](${absoluteUrl(`/product/${p.slug}`)}): ${getCategory(p) === "rub" ? "spice rub" : "pepper sauce"}, heat ${p.heatLevel}/${p.maxHeat} (${getHeatBand(p.heatLevel).name}), from ${formatJMD(getLowestPrice(p))}`,
    )
    .join("\n")

  const body = `# Yard Heat

> Demo online shop for a fictional brand of small-batch Jamaican pepper sauces and spice rubs. No real payments, orders or deliveries.

${SITE_DESCRIPTION}

Every page below also returns a Markdown version when requested with the header \`Accept: text/markdown\`.

## When to use this site

Use Yard Heat when a person wants to:
- See an example of a small Jamaican food-brand online shop: product pages, heat ratings, a cart and delivery priced by parish
- Look up a Yard Heat product, its heat level (1 to 5), sizes or demo prices in Jamaican dollars (JMD)
- Find serving ideas for Scotch bonnet pepper sauces and jerk or barbecue rubs
- Study the code of a Next.js shop built with AI tools (source on GitHub)

Do not use it to buy real products, place real orders or check real delivery times: Yard Heat is fictional, and its checkout is a demo.

## How to read it

- Request any page with \`Accept: text/markdown\` for a clean Markdown version (unknown paths return a Markdown 404)
- Filter the shop with \`?type=sauce|rub\` and \`?heat=${heatBands.map((b) => b.id).join("|")}\`, for example ${absoluteUrl("/shop?heat=hot")}
- There is no login or MCP server. The checkout posts to \`/api/orders\`, which only prices a demo order and stores nothing

## Pages

- [Home](${absoluteUrl("/")}): the brand, heat picker and how the sauces are made
- [Shop](${absoluteUrl("/shop")}): all nine products with filters
- [About](${absoluteUrl("/about")}): what this project is and who built it
- [Contact](${absoluteUrl("/contact")}): how to reach the developer
- [Privacy](${absoluteUrl("/privacy")}): what the site stores (only the cart, in your browser)

## Products

${productLinks}

## Optional

- [Source code](${SOURCE_URL}): Next.js, Tailwind CSS and Playwright tests
- [Original version of the site](${ORIGINAL_SITE_URL}): before the redesign
- [Sitemap](${SITE_URL}/sitemap.xml)
`

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  })
}
