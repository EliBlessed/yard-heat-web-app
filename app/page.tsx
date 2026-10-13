import type { Metadata } from "next"
import { JsonLd } from "@/components/json-ld"
import { homeStructuredData } from "@/lib/structured-data"
import { SiteHeader, FlameMark } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeatPicker } from "@/components/heat-picker"
import { ParishMap } from "@/components/parish-map"
import { Marquee } from "@/components/magicui/marquee"
import { Hero } from "@/components/hero"
import { ProcessSteps } from "@/components/process-steps"
import { HomeFaq } from "@/components/home-faq"

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


export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <JsonLd data={homeStructuredData()} />
      <SiteHeader />

      <main id="main">
        <Hero />

        <section aria-label="What goes in" className="border-y border-ember/20 bg-primary py-3 text-primary-foreground">
          <Marquee pauseOnHover repeat={2} className="[--duration:35s] [--gap:2.5rem]">
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

        <HomeFaq />

        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
          <ParishMap />
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
