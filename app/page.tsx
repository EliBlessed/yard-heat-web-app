import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"

export default function HomePage() {
  return (
    <main className="h-dvh overflow-hidden bg-background">
      <div className="flex h-full flex-col">
        <SiteHeader />

        <section className="grid flex-1 grid-cols-1 items-center gap-6 px-6 sm:px-10 md:grid-cols-2 md:gap-10">
          <div className="flex flex-col gap-5">
            <span className="inline-flex w-fit items-center rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold tracking-wide text-secondary uppercase">
              Small-batch &middot; Made in Jamaica
            </span>
            <h1 className="font-display text-4xl leading-[1.05] text-balance text-foreground sm:text-5xl lg:text-6xl">
              Real yard heat,
              <br />
              <span className="text-primary">bottled bold.</span>
            </h1>
            <p className="max-w-md text-base text-muted-foreground sm:text-lg">
              Small-batch Jamaican pepper sauces and spice rubs made with fire-roasted Scotch bonnets — no fillers,
              all flavor.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Button
                size="lg"
                className="rounded-full px-7 text-base"
                nativeButton={false}
                render={<Link href="/shop" />}
              >
                Shop all
                <ArrowRight data-icon="inline-end" />
              </Button>
            </div>
          </div>

          <div className="relative hidden h-full items-center justify-center md:flex">
            <div className="absolute inset-8 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-secondary/15 to-transparent blur-2xl" />
            <div className="relative h-[85%] w-full max-w-sm overflow-hidden rounded-[2rem] shadow-2xl">
              <Image
                src="/yard-heat-hero.png"
                alt="Bottle of Yard Heat pepper sauce surrounded by fresh Scotch bonnet peppers"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center gap-2 pb-6 text-center text-xs text-muted-foreground sm:gap-3">
          <span>No shortcuts</span>
          <span className="size-1 rounded-full bg-border" />
          <span>No fillers</span>
          <span className="size-1 rounded-full bg-border" />
          <span>100% Jamaican peppers</span>
        </div>
      </div>
    </main>
  )
}
