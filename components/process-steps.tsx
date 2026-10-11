"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react"

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
    <li className="flex flex-col gap-3 pt-6">
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
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] })

  return (
    <div className="relative mt-10">
      <div className="absolute inset-x-0 top-0 h-[3px] rounded-full bg-border" aria-hidden="true" />
      <motion.div
        className="absolute inset-x-0 top-0 h-[3px] origin-left rounded-full bg-gradient-to-r from-secondary to-primary"
        style={{ scaleX: still ? 1 : scrollYProgress }}
        aria-hidden="true"
      />
      <ol ref={ref} className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <Step key={step.title} step={step} index={i} progress={scrollYProgress} still={still} />
        ))}
      </ol>
    </div>
  )
}
