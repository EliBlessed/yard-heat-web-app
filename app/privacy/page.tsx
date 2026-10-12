import type { Metadata } from "next"
import { InfoPage } from "@/components/info-page"

export const metadata: Metadata = {
  title: "Privacy | Yard Heat",
  description: "What the Yard Heat demo shop stores about you: only your cart, in your own browser.",
  alternates: { canonical: "/privacy" },
}

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy"
      intro="Short version: Yard Heat keeps your cart in your own browser and doesn't collect anything else about you."
    >
      <section>
        <h2 className="font-display text-2xl leading-tight tracking-tight">Your cart</h2>
        <p>
          The items you add are saved in your browser&rsquo;s local storage, so your cart is still there when you
          come back. It never leaves your device and is never sent to a server. Clearing your browser data, or
          placing a demo order, empties it.
        </p>
      </section>
      <section>
        <h2 className="font-display text-2xl leading-tight tracking-tight">The checkout form</h2>
        <p>
          The demo checkout asks for a name, address and parish only to show how delivery pricing works. The form
          isn&rsquo;t sent anywhere, and the site never asks for card or bank details.
        </p>
      </section>
      <section>
        <h2 className="font-display text-2xl leading-tight tracking-tight">Analytics</h2>
        <p>
          The site uses Vercel Web Analytics to count page views. It doesn&rsquo;t use cookies and doesn&rsquo;t
          identify individual visitors.
        </p>
      </section>
      <section>
        <h2 className="font-display text-2xl leading-tight tracking-tight">What we don&rsquo;t do</h2>
        <ul>
          <li>No accounts or logins</li>
          <li>No marketing emails</li>
          <li>No selling or sharing of data</li>
        </ul>
      </section>
    </InfoPage>
  )
}
