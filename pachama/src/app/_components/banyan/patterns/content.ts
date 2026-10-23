/* What the patterns show: Pachama's own facts and product copy, spread
 * across its projects so the same one doesn't repeat. Manoa's facts come
 * from its evaluation screen, Central Kalimantan's from the buyer's My
 * projects screen; the lifecycle is the supplier product's own copy.
 * Anything else in this family is marked as sample. */
export const MANOA = {
  name: "Manoa",
  country: "Brazil",
  area: "74,039 hectares",
  type: "REDD+ Avoided Planned Deforestation",
  standard: "Verified Carbon Standard",
  registry: "Verra",
  registryId: "674",
  // The five standards every project on the marketplace is evaluated against.
  about: "Evaluated against Pachama's five standards: accurate, additional, durable, net and beyond carbon.",
} as const;

export const KALIMANTAN = {
  name: "Central Kalimantan Peatlands",
  country: "Indonesia",
  area: "47,237 hectares",
  type: "REDD+ Avoided Planned Deforestation",
} as const;

export const LIFECYCLE = [
  { name: "Screen", text: "Check if your project qualifies as a reforestation carbon project to get in front of financing opportunities." },
  { name: "Qualify", text: "Draft your project plan and ensure alignment with an investment opportunity." },
  { name: "Commit", text: "Make things official and lock in funding to bring your project to life." },
  { name: "Execute", text: "Plant trees and list your project under the registry for credit issuance." },
  { name: "Maintain", text: "Earn carbon credits and check progress every 5 years to keep earning." },
] as const;
