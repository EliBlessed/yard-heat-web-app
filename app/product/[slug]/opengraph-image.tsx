import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { formatJMD, getHeatBand, getLowestPrice, getProduct, products } from "@/lib/product"

// The picture a link preview shows (LinkedIn, WhatsApp, iMessage): the bottle, its name, its heat and its price.
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "Yard Heat product"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

const flame =
  "M51 37.5 c.3 3.8-1.2 6.5-3.3 9.4-1.9 2.6-3.8 5.1-3.6 8.5 .3 4.8 4.2 8.4 9 8.2 5-.2 8.9-4.2 8.8-9.2 -.1-3.8-2.3-7.2-4.1-10.4-1.6-2.9-2.9-6-2.4-9.3 .1-.6.8-.9 1.2-.5 4.8 4.7 9.8 11.2 9.4 18.2 -.5 9-8 16.1-17 15.6-8.8-.5-15.7-7.7-15.3-16.5 .3-6.6 4.3-11.8 7.8-17.1 2.3-3.5 4.5-7.3 4.5-11.6 0-.6.7-1 1.2-.6 2.3 2.1 3.5 5.5 3.8 9.3z"

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug) ?? products[0]
  // The image renderer can't read WebP, so share images use small JPEG copies in public/og.
  const photoFile = product.image.replace(/^\//, "").replace(".webp", ".jpg")
  const [photo, font] = await Promise.all([
    readFile(join(process.cwd(), "public/og", photoFile)),
    readFile(join(process.cwd(), "node_modules/@fontsource/archivo-black/files/archivo-black-latin-400-normal.woff")),
  ])

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#fbf1e2", fontFamily: "Archivo Black" }}>
        <img
          src={`data:image/jpeg;base64,${photo.toString("base64")}`}
          width={504}
          height={630}
          style={{ objectFit: "cover", borderTopRightRadius: 240 }}
          alt=""
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 28, padding: "0 64px", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, color: "#b91c22", fontSize: 30 }}>
            <svg viewBox="30 24 42 50" width={44} height={44} fill="#b91c22">
              <path d={flame} />
            </svg>
            Yard Heat
          </div>
          <div style={{ fontSize: product.name.length > 34 ? 48 : 64, lineHeight: 1.02, color: "#2b1510" }}>{product.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {Array.from({ length: product.maxHeat }, (_, i) => (
              <svg key={i} viewBox="30 24 42 50" width={48} height={48} fill={i < product.heatLevel ? "#b91c22" : "#e3cd9f"}>
                <path d={flame} />
              </svg>
            ))}
            <span style={{ marginLeft: 12, fontSize: 30, color: "#6b4a37" }}>{getHeatBand(product.heatLevel).name}</span>
          </div>
          <div style={{ display: "flex", fontSize: 40, color: "#b91c22" }}>{`From ${formatJMD(getLowestPrice(product))}`}</div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Archivo Black", data: font, weight: 400 }] },
  )
}
