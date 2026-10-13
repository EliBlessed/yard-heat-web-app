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
      "Fire-roasted Jamaican Scotch bonnet peppers slow-simmered with scallion, allspice and a squeeze of lime. No fillers, no shortcuts, just the real yard-style heat.",
    heatLevel: 4,
    maxHeat: 5,
    image: "/yard-heat-bottle-scorpion.webp",
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
    image: "/yard-heat-mango-scotch-bonnet.webp",
    sizeHeading: "Bottle size",
    sizes: bottleSizes([1050, 1550, 2750]),
  },
  {
    slug: "escovitch",
    name: "Escovitch Pepper Sauce",
    tagline: TAGLINE,
    description:
      "The bright, vinegar-sharp pepper sauce of Jamaican escovitch fish: pickled Scotch bonnet with onion, carrot and pimento. Tangy first, then a steady heat.",
    heatLevel: 3,
    maxHeat: 5,
    image: "/yard-heat-escovitch.webp",
    sizeHeading: "Bottle size",
    sizes: bottleSizes([950, 1450, 2600]),
  },
  {
    slug: "smoky-jerk",
    name: "Smoky Jerk Pepper Sauce",
    tagline: TAGLINE,
    description:
      "Scotch bonnet slow-cooked with pimento, scallion, thyme and garlic, the flavours of a jerk pit in a bottle. No fillers, no shortcuts, just real yard-style smoke and fire.",
    heatLevel: 4,
    maxHeat: 5,
    image: "/yard-heat-smoky-jerk.webp",
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
    image: "/yard-heat-guava-bbq.webp",
    sizeHeading: "Bottle size",
    sizes: [
      { id: "250ml", label: "250 ml", volume: "Kitchen bottle", priceJMD: 1650 },
      { id: "500ml", label: "500 ml", volume: "Family bottle", priceJMD: 2900 },
    ],
  },
  {
    slug: "pineapple-ginger",
    name: "Pineapple Ginger Pepper Sauce",
    tagline: TAGLINE,
    description:
      "Sweet Jamaican pineapple blended with fresh ginger and a light touch of yellow Scotch bonnet. Bright and fruity, with a gentle warmth that builds slowly: the easy way into pepper sauce.",
    heatLevel: 1,
    maxHeat: 5,
    image: "/yard-heat-pineapple-ginger.webp",
    sizeHeading: "Bottle size",
    sizes: bottleSizes([1000, 1500, 2700]),
  },
  {
    slug: "jerk-rub",
    name: "Yard Jerk Dry Rub",
    tagline: TAGLINE,
    description:
      "A dry blend of ground pimento, thyme, scallion, garlic, black pepper and dried Scotch bonnet. Rub it into chicken or pork and leave it overnight, for jerk flavour without the marinade.",
    heatLevel: 3,
    maxHeat: 5,
    image: "/yard-heat-jerk-rub.webp",
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
    image: "/yard-heat-bbq-rub.webp",
    sizeHeading: "Jar size",
    sizes: [
      { id: "100g", label: "100 g", volume: "Small jar", priceJMD: 750 },
      { id: "250g", label: "250 g", volume: "Large jar", priceJMD: 1500 },
    ],
  },  {
    slug: "fire-rub",
    name: "Scotch Bonnet Fire Rub",
    tagline: TAGLINE,
    description:
      "Our hottest product: dried Scotch bonnet ground with pimento, garlic and smoked salt. A little goes a long way on wings, pork and anything headed for the coals.",
    heatLevel: 5,
    maxHeat: 5,
    image: "/yard-heat-fire-rub.webp",
    sizeHeading: "Jar size",
    sizes: [
      { id: "100g", label: "100 g", volume: "Small jar", priceJMD: 900 },
      { id: "250g", label: "250 g", volume: "Large jar", priceJMD: 1800 },
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

/** The parish picked on the home page map, which the checkout fills in. */
export const PARISH_STORAGE_KEY = "yard-heat-parish"

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
  if (!parish || !Object.hasOwn(parishDeliveryFees, parish)) return null
  return parishDeliveryFees[parish as Parish]
}

export type ProductCategory = "sauce" | "rub"

/** Rubs are sold in jars, sauces in bottles. */
export function getCategory(product: Product): ProductCategory {
  return product.sizeHeading === "Jar size" ? "rub" : "sauce"
}

export type HeatBand = {
  id: "gentle" | "medium" | "hot"
  name: string
  description: string
  matches: (heatLevel: number) => boolean
}

export const heatBands: HeatBand[] = [
  {
    id: "gentle",
    name: "Gentle",
    description: "Sweet and smoky first, with a warm finish. Good for anyone new to Scotch bonnet.",
    matches: (level) => level <= 2,
  },
  {
    id: "medium",
    name: "Medium",
    description: "Fruit up front, then the pepper builds. The everyday bottle for the table.",
    matches: (level) => level === 3,
  },
  {
    id: "hot",
    name: "Hot",
    description: "Proper yard heat. A few drops go a long way.",
    matches: (level) => level >= 4,
  },
]

export function getHeatBand(heatLevel: number) {
  return heatBands.find((band) => band.matches(heatLevel)) ?? heatBands[heatBands.length - 1]
}

export function getLowestDeliveryFee() {
  return Math.min(...Object.values(parishDeliveryFees))
}

/** Serving ideas shown on each product page, matched to each product's description. */
export const servingIdeas: Record<string, string[]> = {
  "fire-roasted-scotch-bonnet": [
    "A few drops on ackee and saltfish or callaloo",
    "Stirred into soups and stews at the end of cooking",
    "Mixed with mayonnaise for a fiery sandwich spread",
  ],
  "mango-scotch-bonnet": [
    "Spooned over grilled or escovitch fish",
    "As a dip for fried chicken or festival",
    "Brushed on prawns in the last minute on the grill",
  ],
  "smoky-jerk": [
    "Mixed into rice and peas or roast breadfruit",
    "Stirred through a pot of stew peas",
    "As a marinade booster for chicken or pork",
  ],
  "guava-bbq": [
    "Brushed on ribs or chicken in the last few minutes of grilling",
    "As a glaze for baked ham",
    "Mixed with a little lime juice as a wing sauce",
  ],
  "jerk-rub": [
    "Rubbed into chicken or pork and left overnight",
    "Sprinkled on roast potatoes or sweet potato wedges",
    "Mixed with oil and lime for a quick fish seasoning",
  ],
  "pineapple-ginger": [
    "Drizzled over grilled pork chops or jerk pork",
    "As a dipping sauce for shrimp or fish fritters",
    "Stirred into fried rice just before serving",
  ],
  escovitch: [
    "Poured over fried fish with sliced onion and carrot",
    "Splashed on fried dumplings, bammy or festival",
    "Mixed into coleslaw for a sharp, spicy crunch",
  ],
  "fire-rub": [
    "Rubbed into chicken wings an hour before frying or grilling",
    "A pinch in soup or stew for a slow-building heat",
    "Mixed with butter and brushed on roast corn",
  ],
  "bbq-rub": [
    "Rubbed on ribs or chicken before grilling",
    "Tossed with popcorn or roasted peanuts",
    "Sprinkled over corn on the cob with butter",
  ],
}
