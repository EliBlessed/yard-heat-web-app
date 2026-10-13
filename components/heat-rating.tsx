"use client"

import { Flame } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

/** Flames out of five. The lit flames fill in one after another the first time the meter scrolls into view. */
export function HeatRating({
  level,
  max = 5,
  className,
}: {
  level: number
  max?: number
  className?: string
}) {
  const still = useReducedMotion()

  return (
    <motion.div
      className={cn("flex items-center gap-1", className)}
      role="img"
      aria-label={`Heat level ${level} out of ${max}`}
      initial={still ? false : "unlit"}
      whileInView="lit"
      viewport={{ once: true, amount: 0.8 }}
    >
      {Array.from({ length: max }).map((_, i) => (
        <motion.span
          key={i}
          className="flex"
          variants={
            i < level
              ? {
                  unlit: { opacity: 0.25, scale: 0.6 },
                  lit: { opacity: 1, scale: 1, transition: { delay: 0.15 + i * 0.09, type: "spring", stiffness: 420, damping: 14 } },
                }
              : undefined
          }
        >
          <Flame
            className={cn(
              "size-5",
              i < level ? "fill-primary text-primary" : "fill-transparent text-muted-foreground/40",
            )}
          />
        </motion.span>
      ))}
    </motion.div>
  )
}
