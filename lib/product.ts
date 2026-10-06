export type BottleSize = {
  id: string
  label: string
  volume: string
  priceJMD: number
}

export const sauce = {
  slug: "scorpion-scotch-bonnet",
    name: "Fire-Roasted Scotch Bonnet Sauce",
  tagline: "Small-batch heat, bottled in Kingston",
  description:
        "Fire-roasted Jamaican Scotch bonnet peppers slow-simmered with scallion, allspice and a squeeze of lime. No fillers, no shortcuts — just the real yard-style heat.",
  heatLevel: 4,
  maxHeat: 5,
  image: "/yard-heat-bottle-scorpion.png",
  sizes: [
    { id: "150ml", label: "150 ml", volume: "Travel bottle", priceJMD: 950 },
    { id: "250ml", label: "250 ml", volume: "Kitchen bottle", priceJMD: 1450 },
    { id: "500ml", label: "500 ml", volume: "Family bottle", priceJMD: 2600 },
  ] satisfies BottleSize[],
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
]
