/** The product's colour ramps, three stops each, sampled from its picker:
 *  the chips in the layers list, the ramp picker, and the palette. */
export const RAMPS = [
  { name: "Viridis", css: "bg-[linear-gradient(90deg,#301147,#41ab66,#d0da31)]" },
  { name: "Plasma", css: "bg-[linear-gradient(90deg,#260b83,#d1545e,#f0d326)]" },
  { name: "Inferno", css: "bg-[linear-gradient(90deg,#080211,#782056,#f38518)]" },
  { name: "Magma", css: "bg-[linear-gradient(90deg,#0a0714,#681e6b,#f19169)]" },
  { name: "Cividis", css: "bg-[linear-gradient(90deg,#0b2041,#abb7a5,#f0f3d1)]" },
] as const;

/** The chips as the layers list tilts them, a little diagonal. */
export const CHIPS = [
  "bg-[linear-gradient(135deg,#d0da31,#41ab66,#301147)]",
  "bg-[linear-gradient(135deg,#f0d326,#d1545e,#260b83)]",
  "bg-[linear-gradient(135deg,#f9e63f,#f2b705)]",
  "bg-[linear-gradient(135deg,#f19169,#681e6b,#0a0714)]",
  "bg-[linear-gradient(135deg,#f0f3d1,#abb7a5,#0b2041)]",
] as const;
