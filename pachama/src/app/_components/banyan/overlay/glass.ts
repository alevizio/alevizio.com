/* What every Banyan overlay shares, from the Figma: glass (glass level 2 at
 * 30% over an 80px background blur) and the eight places a tooltip or a
 * popover can sit around its trigger, each with a 12×6 arrow pointing back. */
export const GLASS = "bg-bn-glass-2/30 backdrop-blur-[80px]";

export type Placement = "top-left" | "top" | "top-right" | "left" | "right" | "bottom-left" | "bottom" | "bottom-right";

export const PLACEMENTS: Placement[] = ["top-left", "top", "top-right", "left", "right", "bottom-left", "bottom", "bottom-right"];

/* Where the floating box sits around a `relative` wrapper. The gap towards
 * the trigger is padding, not margin, so the pointer can travel from the
 * trigger onto the box without leaving it (WCAG 1.4.13). A side-aligned box
 * reaches 16px past the trigger's centre, where its arrow is. */
export const PLACE: Record<Placement, string> = {
  "top-left": "bottom-full right-1/2 -mr-4 pb-2",
  top: "bottom-full left-1/2 -translate-x-1/2 pb-2",
  "top-right": "bottom-full left-1/2 -ml-4 pb-2",
  left: "right-full top-1/2 -translate-y-1/2 pr-2",
  right: "left-full top-1/2 -translate-y-1/2 pl-2",
  "bottom-left": "top-full right-1/2 -mr-4 pt-2",
  bottom: "top-full left-1/2 -translate-x-1/2 pt-2",
  "bottom-right": "top-full left-1/2 -ml-4 pt-2",
};

const DOWN = "top-full h-1.5 w-3 [clip-path:polygon(0_0,100%_0,50%_100%)]";
const UP = "bottom-full h-1.5 w-3 [clip-path:polygon(50%_0,100%_100%,0_100%)]";

/** The arrow on the box's edge, pointing back at the trigger. */
export const ARROW: Record<Placement, string> = {
  "top-left": `${DOWN} right-2.5`,
  top: `${DOWN} left-1/2 -translate-x-1/2`,
  "top-right": `${DOWN} left-2.5`,
  left: "left-full top-1/2 h-3 w-1.5 -translate-y-1/2 [clip-path:polygon(0_0,100%_50%,0_100%)]",
  right: "right-full top-1/2 h-3 w-1.5 -translate-y-1/2 [clip-path:polygon(100%_0,100%_100%,0_50%)]",
  "bottom-left": `${UP} right-2.5`,
  bottom: `${UP} left-1/2 -translate-x-1/2`,
  "bottom-right": `${UP} left-2.5`,
};

/** "top-left" → "Top left", as the Figma names them. */
export const placementName = (p: Placement) => (p[0].toUpperCase() + p.slice(1)).replace("-", " ");
