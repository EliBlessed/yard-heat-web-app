"use client"

import { motion, useReducedMotion } from "motion/react"
import { FlameMark } from "@/components/site-header"

// Fixed angles and distances, so the burst looks the same every time and server and client agree.
const flames = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2 - Math.PI / 2
  const distance = 70 + (i % 3) * 22
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, turn: (i % 2 ? 1 : -1) * (20 + i * 3), color: i % 3 ? "text-primary" : "text-secondary" }
})

/** A one-off burst of flames behind the order confirmation. Nothing renders under reduced motion. */
export function FlameBurst() {
  const still = useReducedMotion()
  if (still) return null
  return (
    <span aria-hidden="true" data-testid="flame-burst" className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {flames.map((f, i) => (
        <motion.span
          key={i}
          className={`absolute ${f.color}`}
          initial={{ opacity: 1, transform: "translate(0px, 0px) scale(0.5) rotate(0deg)" }}
          animate={{ opacity: [1, 1, 0], transform: `translate(${f.x}px, ${f.y}px) scale(1) rotate(${f.turn}deg)` }}
          transition={{
            delay: 0.05 + (i % 4) * 0.03,
            duration: 0.9,
            ease: [0.23, 1, 0.32, 1],
            // Flames stay bright for most of the flight, then fade as they slow.
            opacity: { duration: 0.9, times: [0, 0.55, 1], delay: 0.05 + (i % 4) * 0.03 },
          }}
        >
          <FlameMark className="size-7" />
        </motion.span>
      ))}
    </span>
  )
}
