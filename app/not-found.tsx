import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader, FlameMark } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main id="main" className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center gap-6 px-5 py-20 sm:px-8">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <FlameMark className="size-14" />
        </span>
        <h1 className="font-display text-5xl leading-none tracking-tight text-foreground sm:text-6xl">
          This bottle&rsquo;s empty
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
          We couldn&rsquo;t find that page. It may have moved, or the link has a typo.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" className="h-12 rounded-full px-7 text-base" nativeButton={false} render={<Link href="/shop" />}>
            Browse the shop
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-foreground/20 bg-transparent px-7 text-base"
            nativeButton={false}
            render={<Link href="/#heat" />}
          >
            Find your heat
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
