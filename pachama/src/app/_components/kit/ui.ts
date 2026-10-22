/* The product's look, as the screens show it: white cards on a pale grey
 * canvas, hairline borders, an action gradient from green to teal, a near-
 * black for the second button. Shared by every rebuilt component. */
export const UI = {
  canvas: "bg-[#f5f6f8]",
  card: "rounded-[12px] border border-[#e3e6e4] bg-white",
  ink: "text-[#141a17]",
  muted: "text-[#5f6b66]",
  label: "type-label text-[#5f6b66]",
  focus: "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#13adb1]",
} as const;
