"use client"

import { useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { parishes } from "@/lib/product"

export function PaymentForm({
  onParishChange,
  onOrderPlaced,
}: {
  onParishChange?: (parish: string | null) => void
  onOrderPlaced?: () => void
}) {
  const [submitted, setSubmitted] = useState(false)
  const [parish, setParish] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    onOrderPlaced?.()
  }

  if (submitted) {
    return (
      <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <p className="font-display text-xl text-foreground">Order confirmed!</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          This is a demo — no payment was processed and no real order was placed.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col gap-4">
      <FieldGroup className="gap-3">
        <Field>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input id="name" placeholder="Sherika Campbell" required />
        </Field>

        <Field>
          <FieldLabel htmlFor="address">Delivery address</FieldLabel>
          <Input id="address" placeholder="12 Hope Road, Kingston" required />
        </Field>

        <Field>
          <FieldLabel htmlFor="parish">Parish</FieldLabel>
          <Select
            required
            value={parish}
            onValueChange={(value) => {
              setParish(value)
              onParishChange?.(value)
            }}
          >
            <SelectTrigger id="parish" className="w-full">
              <SelectValue placeholder="Select parish" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {parishes.map((parish) => (
                  <SelectItem key={parish} value={parish}>
                    {parish}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <p className="text-sm text-muted-foreground">
          Demo store: no payment needed. Your order won&apos;t be processed.
        </p>
      </FieldGroup>

      <div className="mt-auto flex flex-col gap-2">
        <Button type="submit" size="lg" className="w-full rounded-full text-base">
          Place demo order
        </Button>
      </div>
    </form>
  )
}
