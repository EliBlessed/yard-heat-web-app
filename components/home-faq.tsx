import Link from "next/link"
import { formatJMD, getLowestDeliveryFee, parishDeliveryFees } from "@/lib/product"

const highestFee = Math.max(...Object.values(parishDeliveryFees))

const faqs = [
  {
    q: "How hot is five flames?",
    a: "Every product is rated from one to five flames. One and two are gentle: sweet and smoky, with a warm finish. Three is the everyday table sauce. Four and five are proper Scotch bonnet heat, so start with a few drops.",
  },
  {
    q: "What goes into the sauces?",
    a: "Jamaican Scotch bonnet peppers, roasted over open flame and simmered with pimento, scallion and thyme, plus fruit such as mango and guava in some recipes. Nothing is thickened, coloured or bulked out.",
  },
  {
    q: "Sauce or rub: which should I pick?",
    a: "Pepper sauces go on at the end, as a dip, a drizzle or a glaze. Dry rubs go on before cooking: rub them into chicken, pork or fish, or sprinkle them over roast vegetables.",
  },
  {
    q: "How does delivery work?",
    a: `One fee per order, priced by parish: from ${formatJMD(getLowestDeliveryFee())} in Kingston, St. Andrew and St. Catherine up to ${formatJMD(highestFee)} in Westmoreland and Hanover. Pick your parish at checkout to see the exact cost.`,
  },
]

export function HomeFaq() {
  return (
    <section aria-labelledby="faq-heading" className="mx-auto max-w-6xl px-5 pt-16 sm:px-8 md:pt-24">
      <h2 id="faq-heading" className="font-display text-4xl leading-none tracking-tight text-foreground sm:text-5xl">
        Good to know
      </h2>
      <dl className="mt-8 grid gap-5 md:grid-cols-2">
        {faqs.map(({ q, a }) => (
          <div key={q} className="rounded-[1.75rem] bg-card p-6 ring-1 ring-border">
            <dt className="text-lg font-bold text-foreground">{q}</dt>
            <dd className="mt-2 text-base leading-relaxed text-muted-foreground">{a}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-sm text-muted-foreground">
        Yard Heat is a fictional brand and a demo shop.{" "}
        <Link href="/about" className="font-semibold text-primary underline underline-offset-4">
          Read about the project
        </Link>
        .
      </p>
    </section>
  )
}
