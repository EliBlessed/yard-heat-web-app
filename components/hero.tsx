"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { Button } from "@/components/ui/button"
import { FlameMark } from "@/components/site-header"

const ease = [0.22, 1, 0.36, 1] as const
const headline = ["Real yard heat,", "bottled bold."]

/**
 * The opening moment: the red arch rises like sauce filling a bottle, the photo settles in,
 * and the headline lines slide up from behind their baseline. Plays once, on load.
 */
export function Hero() {
  const still = useReducedMotion()
  const t = (delay: number, duration = 0.8) => (still ? { duration: 0 } : { delay, duration, ease })

  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 pt-10 pb-14 sm:px-8 md:grid-cols-[1.15fr_1fr] md:pt-16 md:pb-20">
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.95] tracking-tight text-foreground">
          {headline.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className="block"
                initial={still ? false : { y: "105%" }}
                animate={{ y: 0 }}
                transition={t(0.35 + i * 0.12, 0.9)}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div
          className="flex flex-col gap-6"
          initial={still ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0.75)}
        >
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
            Pepper sauces and spice rubs made in small batches with fire-roasted Jamaican Scotch bonnets. No fillers,
            all flavour.
          </p>
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
        </motion.div>
      </div>

      <div className="relative mx-auto w-full max-w-sm md:max-w-md">
        <motion.div
          data-testid="hero-arch"
          className="relative aspect-[4/5] w-full overflow-hidden rounded-t-[12rem] rounded-b-[2rem] bg-primary shadow-[0_30px_60px_-30px_rgb(122_16_22/0.6)]"
          initial={still ? false : { clipPath: "inset(100% 0% 0% 0% round 12rem 12rem 2rem 2rem)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0% round 12rem 12rem 2rem 2rem)" }}
          transition={t(0, 1.1)}
        >
          <motion.div
            className="absolute inset-0"
            initial={still ? false : { opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={t(0.45, 1.2)}
          >
            <Image
              src="/yard-heat-hero.webp"
              alt="Bottle of Yard Heat pepper sauce surrounded by fresh Scotch bonnet peppers"
              fill
              sizes="(min-width: 768px) 28rem, 90vw"
              className="object-cover"
              priority
            />
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute -bottom-5 -left-3 flex items-center gap-2 rounded-full bg-foreground py-2 pr-4 pl-2 text-sm font-semibold text-background shadow-lg sm:-left-8"
          initial={still ? false : { opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={still ? { duration: 0 } : { delay: 1.15, type: "spring", stiffness: 260, damping: 18 }}
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-primary">
            <FlameMark className="size-7" />
          </span>
          Bottled in Kingston
        </motion.div>
      </div>
    </section>
  )
}
