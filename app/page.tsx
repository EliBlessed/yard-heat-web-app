import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SiteHeader, FlameMark } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeatPicker } from "@/components/heat-picker"
import { Marquee } from "@/components/magicui/marquee"
import { BlurFade } from "@/components/magicui/blur-fade"
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

const steps = [
  {
    title: "Roast",
    body: "Whole Scotch bonnets go over open flame until the skins blister, which softens the bite and brings out the fruit.",
  },
  {
    title: "Simmer",
    body: "The peppers cook down slowly with pimento, scallion and thyme. Nothing is thickened, coloured or bulked out.",
  },
  {
    title: "Bottle",
    body: "Each batch is bottled hot in Kingston and labelled by hand, a few dozen bottles at a time.",
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />

      <main id="main">
        <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 pt-10 pb-14 sm:px-8 md:grid-cols-[1.15fr_1fr] md:pt-16 md:pb-20">
          <div className="flex flex-col gap-6">
            <BlurFade delay={0.05}>
              <h1 className="font-display text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.95] tracking-tight text-balance text-foreground">
                Real yard heat, bottled bold.
              </h1>
            </BlurFade>
            <BlurFade delay={0.15}>
              <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
                Pepper sauces and spice rubs made in small batches with fire-roasted Jamaican Scotch bonnets. No
                fillers, all flavour.
              </p>
            </BlurFade>
            <BlurFade delay={0.25}>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg" className="h-12 rounded-full px-7 text-base" nativeButton={false} render={<Link href="/shop" />}>
                  Shop all six
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-foreground/20 bg-transparent px-7 text-base"
                  nativeButton={false}
                  render={<Link href="#heat" />}
                >
                  Find your heat
                </Button>
              </div>
            </BlurFade>
          </div>

          <BlurFade delay={0.2} className="relative mx-auto w-full max-w-sm md:max-w-md">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-[12rem] rounded-b-[2rem] bg-primary shadow-[0_30px_60px_-30px_rgb(122_16_22/0.6)]">
              <Image
                src="/yard-heat-hero.png"
                alt="Bottle of Yard Heat pepper sauce surrounded by fresh Scotch bonnet peppers"
                fill
                sizes="(min-width: 768px) 28rem, 90vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-5 -left-3 flex items-center gap-2 rounded-full bg-foreground py-2 pr-4 pl-2 text-sm font-semibold text-background shadow-lg sm:-left-8">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary">
                <FlameMark className="size-5" />
              </span>
              Bottled in Kingston
            </div>
          </BlurFade>
        </section>

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
            <ol className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              {steps.map((step, i) => (
                <li key={step.title} className="flex flex-col gap-3 border-t-2 border-foreground pt-5">
                  <span className="font-display text-5xl leading-none text-primary" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                  <p className="text-base leading-relaxed text-muted-foreground">{step.body}</p>
                </li>
              ))}
            </ol>
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
