import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader, FlameMark } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeatPicker } from "@/components/heat-picker"
import { Marquee } from "@/components/magicui/marquee"
import { Hero } from "@/components/hero"
import { ProcessSteps } from "@/components/process-steps"
import { formatJMD, getLowestDeliveryFee, parishes } from "@/lib/product"

const ingredients = [
  "Scotch bonnet",
  "Pimento",
  "Scallion",
  "Thyme",
  "Garlic",
  "Lime",
  "Ginger",
  "Mango",
  "Guava",
]


export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />

      <main id="main">
        <Hero />

        <section aria-label="What goes in" className="border-y border-ember/20 bg-primary py-3 text-primary-foreground">
          <Marquee pauseOnHover className="[--duration:35s] [--gap:2.5rem]">
            {ingredients.map((item) => (
              <span key={item} className="flex items-center gap-10 font-display text-xl whitespace-nowrap sm:text-2xl">
                {item}
                <FlameMark className="size-5 text-secondary" />
              </span>
            ))}
          </Marquee>
        </section>

        <section id="heat" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 sm:px-8 md:py-24">
          <div className="mb-8 flex flex-col gap-3">
            <h2 className="font-display text-4xl leading-none tracking-tight text-foreground sm:text-5xl">
              How hot do you like it?
            </h2>
            <p className="max-w-xl text-base text-muted-foreground">
              Every bottle and jar is rated out of five flames. Pick a heat to see what fits.
            </p>
          </div>
          <HeatPicker />
        </section>

        <section className="bg-card py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <h2 className="font-display max-w-lg text-4xl leading-none tracking-tight text-foreground sm:text-5xl">
              From the fire to the bottle
            </h2>
            <ProcessSteps />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-scallion px-7 py-10 text-scallion-foreground md:flex-row md:items-center md:px-12">
            <div className="flex flex-col gap-2">
              <h2 className="font-display text-3xl leading-tight sm:text-4xl">
                Delivered to all {parishes.length} parishes
              </h2>
              <p className="max-w-md text-scallion-foreground/80">
                Delivery starts at {formatJMD(getLowestDeliveryFee())} in Kingston, St. Andrew and St. Catherine. Pick
                your parish at checkout to see the exact cost.
              </p>
            </div>
            <Button
              size="lg"
              className="h-12 rounded-full bg-scallion-foreground px-7 text-base text-scallion hover:bg-white"
              nativeButton={false}
              render={<Link href="/shop" />}
            >
              Start shopping
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
