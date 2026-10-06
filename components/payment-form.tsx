"use client"

import { useState } from "react"
import { Lock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { parishes } from "@/lib/product"

export function PaymentForm({
  onParishChange,
}: {
  onParishChange?: (parish: string | null) => void
}) {
  const [submitted, setSubmitted] = useState(false)
  const [parish, setParish] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
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

        <Field>
          <FieldLabel htmlFor="card">Card number</FieldLabel>
          <Input id="card" inputMode="numeric" placeholder="4242 4242 4242 4242" required />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor="expiry">Expiry</FieldLabel>
            <Input id="expiry" placeholder="MM/YY" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="cvv">CVV</FieldLabel>
            <Input id="cvv" inputMode="numeric" placeholder="123" required />
          </Field>
        </div>
      </FieldGroup>

      <div className="mt-auto flex flex-col gap-2">
        <Button type="submit" size="lg" className="w-full rounded-full text-base">
          Place demo order
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" />
          Demo only — no real payment is processed
        </p>
      </div>
    </form>
  )
}
