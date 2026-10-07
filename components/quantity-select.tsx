"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MAX_QUANTITY } from "@/lib/cart"

const options = Array.from({ length: MAX_QUANTITY }, (_, i) => String(i + 1))

export function QuantitySelect({
  value,
  onChange,
  id,
  label = "Quantity",
}: {
  value: number
  onChange: (quantity: number) => void
  id?: string
  label?: string
}) {
  return (
    <Select value={String(value)} onValueChange={(v) => v && onChange(Number(v))}>
      <SelectTrigger id={id} aria-label={label} className="w-20">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((n) => (
            <SelectItem key={n} value={n}>
              {n}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export function BulkOrderNote({ className }: { className?: string }) {
  return (
    <p className={className ?? "text-xs text-muted-foreground"}>
      Ordering more than {MAX_QUANTITY}? Contact us for bulk orders.
    </p>
  )
}
