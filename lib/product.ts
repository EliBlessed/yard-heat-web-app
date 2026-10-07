export type BottleSize = {
  id: string
  label: string
  volume: string
  priceJMD: number
}

export type ProductSize = BottleSize

export type Product = {
  slug: string
  name: string
  tagline: string
  description: string
  heatLevel: number
  maxHeat: number
  image: string
  sizeHeading: string
  sizes: ProductSize[]
}

const TAGLINE = "Small-batch heat, bottled in Kingston"

const bottleSizes = (prices: [number, number, number]): ProductSize[] => [
  { id: "150ml", label: "150 ml", volume: "Travel bottle", priceJMD: prices[0] },
  { id: "250ml", label: "250 ml", volume: "Kitchen bottle", priceJMD: prices[1] },
  { id: "500ml", label: "500 ml", volume: "Family bottle", priceJMD: prices[2] },
]

export const products: Product[] = [
  {
    slug: "fire-roasted-scotch-bonnet",
    name: "Fire-Roasted Scotch Bonnet Sauce",
    tagline: TAGLINE,
    description:
      "Fire-roasted Jamaican Scotch bonnet peppers slow-simmered with scallion, allspice and a squeeze of lime. No fillers, no shortcuts — just the real yard-style heat.",
    heatLevel: 4,
    maxHeat: 5,
    image: "/yard-heat-bottle-scorpion.png",
    sizeHeading: "Bottle size",
    sizes: bottleSizes([950, 1450, 2600]),
  },
  {
    slug: "mango-scotch-bonnet",
    name: "Mango Scotch Bonnet Sauce",
    tagline: TAGLINE,
    description:
      "Ripe Jamaican mango blended with fresh Scotch bonnet, a touch of ginger and a squeeze of lime. Sweet first, then the heat builds: made for fish, chicken and anything off the grill.",
    heatLevel: 3,
    maxHeat: 5,
    image: "/yard-heat-mango-scotch-bonnet.jpg",
    sizeHeading: "Bottle size",
    sizes: bottleSizes([1050, 1550, 2750]),
  },
  {
    slug: "smoky-jerk",
    name: "Smoky Jerk Pepper Sauce",
    tagline: TAGLINE,
    description:
      "Scotch bonnet slow-cooked with pimento, scallion, thyme and garlic, the flavours of a jerk pit in a bottle. No fillers, no shortcuts, just real yard-style smoke and fire.",
    heatLevel: 4,
    maxHeat: 5,
    image: "/yard-heat-smoky-jerk.jpg",
    sizeHeading: "Bottle size",
    sizes: bottleSizes([950, 1450, 2600]),
  },
  {
    slug: "guava-bbq",
    name: "Guava Scotch Bonnet Barbecue Sauce",
    tagline: TAGLINE,
    description:
      "Sweet guava simmered down with brown sugar, pimento and a measured hit of Scotch bonnet, into a thick, sticky glaze. Brush it on ribs or chicken in the last minutes of grilling.",
    heatLevel: 2,
    maxHeat: 5,
    image: "/yard-heat-guava-bbq.jpg",
    sizeHeading: "Bottle size",
    sizes: [
      { id: "250ml", label: "250 ml", volume: "Kitchen bottle", priceJMD: 1650 },
      { id: "500ml", label: "500 ml", volume: "Family bottle", priceJMD: 2900 },
    ],
  },
  {
    slug: "jerk-rub",
    name: "Yard Jerk Dry Rub",
    tagline: TAGLINE,
    description:
      "A dry blend of ground pimento, thyme, scallion, garlic, black pepper and dried Scotch bonnet. Rub it into chicken or pork and leave it overnight, for jerk flavour without the marinade.",
    heatLevel: 3,
    maxHeat: 5,
    image: "/yard-heat-jerk-rub.jpg",
    sizeHeading: "Jar size",
    sizes: [
      { id: "100g", label: "100 g", volume: "Small jar", priceJMD: 800 },
      { id: "250g", label: "250 g", volume: "Large jar", priceJMD: 1600 },
    ],
  },
  {
    slug: "bbq-rub",
    name: "Yard Barbecue Spice Rub",
    tagline: TAGLINE,
    description:
      "Smoked paprika, brown sugar, garlic, onion and pimento, with a gentle kick of Scotch bonnet. It builds a sweet, smoky crust on anything headed for the grill.",
    heatLevel: 2,
    maxHeat: 5,
    image: "/yard-heat-bbq-rub.jpg",
    sizeHeading: "Jar size",
    sizes: [
      { id: "100g", label: "100 g", volume: "Small jar", priceJMD: 750 },
      { id: "250g", label: "250 g", volume: "Large jar", priceJMD: 1500 },
    ],
  },
]

export function getProduct(slug: string | null | undefined) {
  return products.find((p) => p.slug === slug)
}

export function getLowestPrice(product: Product) {
  return Math.min(...product.sizes.map((s) => s.priceJMD))
}

export function formatJMD(amount: number) {
  return `J$${amount.toLocaleString("en-JM")}`
}

export const parishes = [
  "Kingston",
  "St. Andrew",
  "St. Catherine",
  "Clarendon",
  "Manchester",
  "St. Elizabeth",
  "Westmoreland",
  "Hanover",
  "St. James",
  "Trelawny",
  "St. Ann",
  "St. Mary",
  "Portland",
  "St. Thomas",
] as const

export type Parish = (typeof parishes)[number]

export const parishDeliveryFees: Record<Parish, number> = {
  Kingston: 400,
  "St. Andrew": 400,
  "St. Catherine": 400,
  "St. Thomas": 1000,
  Clarendon: 1000,
  "St. Mary": 1500,
  Portland: 1500,
  Manchester: 1500,
  "St. Ann": 1500,
  "St. Elizabeth": 2500,
  Trelawny: 2500,
  "St. James": 3000,
  Westmoreland: 3500,
  Hanover: 3500,
}

export function getParishDeliveryFee(parish: string | null | undefined) {
  if (!parish || !(parish in parishDeliveryFees)) return null
  return parishDeliveryFees[parish as Parish]
}
