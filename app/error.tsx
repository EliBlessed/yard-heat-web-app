"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

// Shown if a page throws while rendering. The header and footer may be what failed, so this page stands alone.
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main" className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-start justify-center gap-6 px-5 py-20 sm:px-8">
      <h1 className="font-display text-5xl leading-none tracking-tight text-foreground sm:text-6xl">Something boiled over</h1>
      <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
        This page hit an error. Try again, or head back to the shop.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button size="lg" className="h-12 rounded-full px-7 text-base" onClick={reset}>
          Try again
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-12 rounded-full border-foreground/20 bg-transparent px-7 text-base"
          nativeButton={false}
          render={<Link href="/shop" />}
        >
          Back to the shop
        </Button>
      </div>
    </main>
  )
}
