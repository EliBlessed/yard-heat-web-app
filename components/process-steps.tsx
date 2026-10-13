"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react"
import { cn } from "@/lib/utils"

const steps = [
  {
    title: "Roast",
    image: "/yard-heat-process-roast.webp",
    alt: "Scotch bonnet peppers blistering on a cast-iron grill over charcoal",
    body: "Whole Scotch bonnets go over open flame until the skins blister, which softens the bite and brings out the fruit.",
  },
  {
    title: "Simmer",
    image: "/yard-heat-process-simmer.webp",
    alt: "Pepper sauce bubbling in a Dutch pot with scallion, thyme, pimento and garlic beside it",
    body: "The peppers cook down slowly with pimento, scallion and thyme. Nothing is thickened, coloured or bulked out.",
  },
  {
    title: "Bottle",
    image: "/yard-heat-process-bottle.webp",
    alt: "Five freshly filled bottles of pepper sauce, still steaming, with caps and blank labels",
    body: "Each batch is bottled hot in Kingston and labelled by hand, a few dozen bottles at a time.",
  },
]

function Step({
  step,
  index,
  progress,
  still,
}: {
  step: (typeof steps)[number]
  index: number
  progress: MotionValue<number>
  still: boolean
}) {
  // Each step lights up as the heat line reaches it.
  const start = index / steps.length
  const lit = useTransform(progress, [start, start + 0.12], [0, 1])
  const color = useTransform(lit, [0, 1], ["rgb(214 190 160)", "rgb(185 28 34)"])

  return (
    <li className="flex flex-col gap-3 md:min-h-[65vh] md:justify-center">
      {/* Phones see each photo with its step; on wider screens the pinned photo beside the steps changes instead. */}
      <Image
        src={step.image}
        alt={step.alt}
        width={825}
        height={1024}
        sizes="100vw"
        className="mb-2 aspect-[4/3] w-full rounded-[1.5rem] object-cover md:hidden"
      />
      <motion.span
        className="font-display text-6xl leading-none"
        style={{ color: still ? "rgb(185 28 34)" : color }}
        aria-hidden="true"
      >
        {index + 1}
      </motion.span>
      <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
      <p className="text-base leading-relaxed text-muted-foreground">{step.body}</p>
    </li>
  )
}

export function ProcessSteps() {
  const ref = useRef<HTMLOListElement>(null)
  const still = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] })
  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(p * steps.length)))),
  )

  return (
    <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
      <div className="hidden md:block">
        <div className="sticky top-24 aspect-[825/1024] max-h-[calc(100dvh-8rem)] overflow-hidden rounded-[2rem] bg-muted">
          {steps.map((step, i) => (
            <Image
              key={step.title}
              src={step.image}
              alt={i === active ? step.alt : ""}
              aria-hidden={i !== active}
              fill
              sizes="(min-width: 1152px) 540px, 50vw"
              className={cn(
                "object-cover transition-[opacity,scale] duration-500 ease-out motion-reduce:transition-none",
                i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
              )}
            />
          ))}
        </div>
      </div>

      <div className="relative pl-8">
        <div className="absolute inset-y-0 left-0 w-[3px] rounded-full bg-border" aria-hidden="true" />
        <motion.div
          className="absolute inset-y-0 left-0 w-[3px] origin-top rounded-full bg-gradient-to-b from-secondary to-primary"
          style={{ scaleY: still ? 1 : scrollYProgress }}
          aria-hidden="true"
        />
        <ol ref={ref} data-active-step={active} className="flex flex-col gap-12 md:gap-0">
          {steps.map((step, i) => (
            <Step key={step.title} step={step} index={i} progress={scrollYProgress} still={still} />
          ))}
        </ol>
      </div>
    </div>
  )
}
