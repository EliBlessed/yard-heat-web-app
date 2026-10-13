import type { Metadata } from "next"
import Link from "next/link"
import { InfoPage } from "@/components/info-page"
import { ORIGINAL_SITE_URL, SOURCE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "About | Yard Heat",
  description: "What Yard Heat is, who built it and how: a demo Jamaican pepper sauce shop and portfolio project.",
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <InfoPage
      title="About Yard Heat"
      intro="Yard Heat is a working demo of an online shop for a small-batch Jamaican pepper sauce brand. The brand is made up; the shop, its code and its tests are real."
    >
      <section>
        <h2 className="font-display text-2xl leading-tight tracking-tight">What it is</h2>
        <p>
          The shop sells nine products built on Jamaican Scotch bonnet: six pepper sauces and three dry rubs, three at each heat level. Each one
          has a heat rating out of five, sizes and prices in Jamaican dollars, and serving ideas. You can filter by
          type and heat, add items to a cart, and try a demo checkout where delivery is priced by parish, from
          Kingston to Hanover.
        </p>
      </section>
      <section>
        <h2 className="font-display text-2xl leading-tight tracking-tight">Who built it</h2>
        <p>
          Yard Heat is a portfolio project by Elijah Johnson, who is moving from construction into data analytics
          and AI. It started as the NextWork guided project &ldquo;Ship a Landing Page with v0 and Vercel&rdquo;
          and grew from a one-page demo into a full shop. Elijah chose the brand, products, prices and delivery
          fees, directed the AI tools that wrote the code, and tested every change.
        </p>
      </section>
      <section>
        <h2 className="font-display text-2xl leading-tight tracking-tight">How it was built</h2>
        <ul>
          <li>Next.js and Tailwind CSS, hosted on Vercel</li>
          <li>Code written with Claude Code, most product photos made with Gemini</li>
          <li>Automated Playwright tests on desktop and phone screens</li>
        </ul>
        <p>
          The <a href={ORIGINAL_SITE_URL}>original version</a> is still online for comparison, and the{" "}
          <a href={SOURCE_URL}>source code is on GitHub</a>. Ready to look around?{" "}
          <Link href="/shop">Visit the shop</Link>.
        </p>
      </section>
    </InfoPage>
  )
}
