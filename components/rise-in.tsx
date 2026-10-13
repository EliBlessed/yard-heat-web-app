"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

/**
 * Rises and fades its content in the first time it scrolls into view. `index` staggers cards
 * along a row of three. Renders a plain div when the device asks for reduced motion.
 */
export function RiseIn({ children, index = 0, className }: { children: ReactNode; index?: number; className?: string }) {
  const still = useReducedMotion()
  if (still) return <div className={className}>{children}</div>

  return (
    <motion.div
      data-testid="rise-in"
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: (index % 3) * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
