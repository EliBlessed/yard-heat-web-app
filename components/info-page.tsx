import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

// Shared layout for the About, Contact and Privacy pages, matching the shop page's spacing and type.
export function InfoPage({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-3xl px-5 pt-10 pb-16 sm:px-8 md:pt-14">
        <h1 className="font-display text-5xl leading-none tracking-tight text-foreground sm:text-6xl">{title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{intro}</p>
        <div className="mt-6 rounded-[1.25rem] bg-card px-5 py-4 text-sm text-foreground ring-1 ring-border">
          Yard Heat is a fictional brand and this is a demo shop. No payments are taken and no orders are shipped.
        </div>
        <div className="mt-10 flex flex-col gap-8 text-base leading-relaxed text-foreground [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_li]:ml-5 [&_li]:list-disc [&_section]:flex [&_section]:flex-col [&_section]:gap-3">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
