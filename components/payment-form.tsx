"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PARISH_STORAGE_KEY, parishes } from "@/lib/product"

export function PaymentForm({
  onParishChange,
  onPlaceOrder,
}: {
  onParishChange?: (parish: string | null) => void
  /** Places the order; resolves to an error message, or null once the order has gone through. */
  onPlaceOrder: (parish: string) => Promise<string | null>
}) {
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parish, setParish] = useState<string | null>(null)

  // Start with the parish picked on the home page map, if there is one.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PARISH_STORAGE_KEY)
      if (saved && (parishes as readonly string[]).includes(saved)) {
        setParish(saved)
        onParishChange?.(saved)
      }
    } catch {}
    // Only once, on arrival: later changes come from the select itself.
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!parish || placing) return
    setPlacing(true)
    setError(null)
    const problem = await onPlaceOrder(parish)
    if (problem) {
      setError(problem)
      setPlacing(false)
    }
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
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full rounded-full text-base" disabled={placing}>
          {placing ? "Placing order…" : "Place demo order"}
        </Button>
      </div>
    </form>
  )
}
