import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

export function HeatRating({
  level,
  max = 5,
  className,
}: {
  level: number
  max?: number
  className?: string
}) {
  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="img"
      aria-label={`Heat level ${level} out of ${max}`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <Flame
          key={i}
          className={cn(
            "size-5",
            i < level ? "fill-primary text-primary" : "fill-transparent text-muted-foreground/40",
          )}
        />
      ))}
    </div>
  )
}
