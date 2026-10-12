import { products } from "@/lib/product"
import { OWNER_LINKEDIN, OWNER_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOURCE_URL, absoluteUrl } from "@/lib/site"

// Honest identity data: Yard Heat is a fictional demo shop, so there is no street address,
// phone number or real offer to publish. Products are listed without prices for sale.
export function homeStructuredData() {
  const storeId = `${SITE_URL}/#store`
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en-JM",
        publisher: { "@id": storeId },
      },
      {
        "@type": "OnlineStore",
        "@id": storeId,
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl("/icon.svg"),
        image: absoluteUrl("/og-image.jpg"),
        description: SITE_DESCRIPTION,
        slogan: "Real yard heat, bottled bold.",
        areaServed: { "@type": "Country", name: "Jamaica" },
        founder: { "@type": "Person", name: OWNER_NAME, sameAs: [OWNER_LINKEDIN] },
        sameAs: [SOURCE_URL],
      },
      {
        "@type": "ItemList",
        name: "Yard Heat products",
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: p.name,
            url: absoluteUrl(`/product/${p.slug}`),
            image: absoluteUrl(p.image),
            description: p.description,
            brand: { "@type": "Brand", name: SITE_NAME },
          },
        })),
      },
    ],
  }
}
