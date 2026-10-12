import type { Metadata } from "next"
import Link from "next/link"
import { InfoPage } from "@/components/info-page"
import { OWNER_LINKEDIN, SOURCE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact | Yard Heat",
  description: "How to reach the developer of the Yard Heat demo shop.",
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return (
    <InfoPage
      title="Contact"
      intro="Yard Heat isn't a real business, so there's no customer service line, phone number or shop address. You can still reach the person who built it."
    >
      <section>
        <h2 className="font-display text-2xl leading-tight tracking-tight">About the project</h2>
        <p>
          For questions about how the shop was designed or built, feedback on the site, or work opportunities,
          contact Elijah Johnson on <a href={OWNER_LINKEDIN}>LinkedIn</a>.
        </p>
      </section>
      <section>
        <h2 className="font-display text-2xl leading-tight tracking-tight">Found a bug?</h2>
        <p>
          If something on the site doesn&rsquo;t work as expected, open an issue on the{" "}
          <a href={`${SOURCE_URL}/issues`}>GitHub repository</a>. Say which page you were on, what you clicked and
          what happened, and include your device and browser if you can.
        </p>
      </section>
      <section>
        <h2 className="font-display text-2xl leading-tight tracking-tight">Orders and deliveries</h2>
        <p>
          No orders are ever placed or shipped, so there&rsquo;s nothing to track or refund. The checkout is a demo
          that shows how delivery pricing by parish would work. <Link href="/shop">Browse the products</Link> to try
          it.
        </p>
      </section>
    </InfoPage>
  )
}
