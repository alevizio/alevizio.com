"use client";

import { memo, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { LOGO_ICON_PATH, LOGO_WORDMARK_PATH } from "./logo-paths";
import { usePerfMode } from "./perf-mode";

/* ─── Conveyor Overlay ──────────────────────────────────────────────
 * SVG layered on top of /work/messa/hero/factory-blank.png (1614×676, RGBA).
 *
 * Pixel-perfect belt paths: the mechanism positions were extracted from
 * the PNG by scanning vertical pixel columns for the dark dotted teeth
 * pattern (see /tmp/find-belts2.py). The TOP of each detected dark run
 * is the bottom of the cream belt deck, so paths sit 15px above the
 * detected top — that lands box BOTTOMS on the belt deck cleanly.
 *
 * Each belt has its own conceptual story stage (variant 1→4), and
 * multiple boxes traverse each belt staggered in time so the conveyor
 * feels alive rather than ticking through one item at a time. */

type Belt = {
  id: string;
  d: string;
  /** Total seconds for one card to traverse the belt. */
  dur: number;
  /** How many cards travel this belt simultaneously, staggered. */
  cardCount: number;
  /** Which transformation stage to draw on this belt's cards. */
  variant: 1 | 2 | 3 | 4;
};

/* Common shape — both wall masks (hard clip behind walls) and door
 * shadows (visible darkening at doorways) are positioned & shaped
 * the same way. They're stored as separate arrays so each can be
 * moved/resized/labeled independently in the calibrator.
 *
 * Fields:
 *   x, y    top-left corner in PNG viewBox units (1614×676)
 *   w, h    dimensions in viewBox units
 *   slant   optional shear (degrees) — positive tilts top-right UP
 *           so the polygon matches an iso left-wall; negative tilts
 *           DOWN for an iso right-wall
 *   label   optional display label for the calibrator
 */
export type WallRect = {
  x: number;
  y: number;
  w: number;
  h: number;
  slant?: number;
  label?: string;
  /** Optional corner radius in viewBox units. When > 0 the
   * polygon is rendered as a path with quadratic-bezier rounded
   * corners (works for slanted parallelograms too). */
  radius?: number;
  /** Custom polygon vertices. When set (≥3 points), the mask is
   * drawn as this exact polygon and x/y/w/h/slant are IGNORED.
   * Use this for complex shapes — L's, T's, anything beyond a
   * sheared rectangle. radius still applies (rounds the corners).
   * The mask calibrator's vertex handles auto-convert a mask into
   * polygon mode by baking its current corners into this field. */
  points?: { x: number; y: number }[];
};

/* Door shadow — same shape as a wall mask but rendered as a
 * VISIBLE black-to-transparent gradient polygon on top of the
 * conveyor (not part of the SVG mask). `fade` is required and
 * points toward the DARKER end of the gradient (the building
 * interior side); the opposite edge is fully transparent.
 *
 * `angle` is an optional fine-grained override: when set, the
 * gradient runs at exactly that angle in degrees (0 = dark on
 * right, 90 = dark on bottom, 180 = dark on left, 270 = dark on
 * top). When not set, the angle is derived from `fade`.
 *
 * `darkness` / `lightness` are optional per-shadow opacity
 * overrides for the two ends of the gradient. They fall back to
 * the global DEFAULT_SHADOW_DARKNESS / _LIGHTNESS values when not
 * set on the shadow. */
export type DoorShadow = WallRect & {
  fade: "left" | "right" | "up" | "down";
  angle?: number;
  darkness?: number;
  lightness?: number;
  /** Optional per-shadow gradient color. Defaults to the global
   * DEFAULT_SHADOW_COLOR. Use "white" for a highlight/glow effect
   * instead of a dark shadow. Any CSS color string works. */
  color?: string;
};

/* Convert a DoorShadow to its gradient angle in degrees. Uses the
 * explicit `angle` if set, else maps `fade` to the nearest
 * cardinal. */
export function shadowAngleDeg(s: DoorShadow): number {
  if (typeof s.angle === "number") return s.angle;
  const cardinal: Record<DoorShadow["fade"], number> = {
    right: 0,
    down: 90,
    left: 180,
    up: 270,
  };
  return cardinal[s.fade];
}

/* Compute the four object-bounding-box-space endpoints (x1,y1) →
 * (x2,y2) for a linear gradient at the given angle. (x1,y1) is the
 * LIGHT end of the gradient; (x2,y2) is the DARK end. Kept around
 * for callers that want a bbox-aligned gradient; the preview /
 * production rendering use shadowGradientUserSpace below so the
 * gradient extents match the actual polygon shape. */
export function shadowGradientCoords(deg: number): {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
} {
  const rad = (deg * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  return {
    x1: 0.5 - dx * 0.5,
    y1: 0.5 - dy * 0.5,
    x2: 0.5 + dx * 0.5,
    y2: 0.5 + dy * 0.5,
  };
}

/* USER-SPACE gradient endpoints that snap exactly to the polygon's
 * projected extent along the angle direction. Use these with
 * gradientUnits="userSpaceOnUse" so the gradient ACTUALLY reaches
 * lightness opacity at the polygon's lightness-side corner and
 * darkness opacity at the darkness-side corner — bbox-aligned
 * gradients fall short on slanted parallelograms because their
 * bbox is larger than the polygon. */
export function shadowGradientUserSpace(s: DoorShadow): {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
} {
  const corners = wallRectCorners(s);
  const angle = shadowAngleDeg(s);
  const rad = (angle * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  // Project each corner onto the gradient's direction vector — the
  // span of projections is the polygon's extent along that axis.
  const projections = corners.map(([x, y]) => x * dx + y * dy);
  const minProj = Math.min(...projections);
  const maxProj = Math.max(...projections);
  const cx = corners.reduce((sum, p) => sum + p[0], 0) / 4;
  const cy = corners.reduce((sum, p) => sum + p[1], 0) / 4;
  const centerProj = cx * dx + cy * dy;
  // Walk out from the centroid by the larger half-extent so the
  // gradient endpoints sit at the polygon's lightness / darkness
  // corners. Symmetric for centered polygons; for off-center ones
  // we err on the side of full coverage.
  const halfExtent = Math.max(centerProj - minProj, maxProj - centerProj);
  return {
    x1: cx - dx * halfExtent,
    y1: cy - dy * halfExtent,
    x2: cx + dx * halfExtent,
    y2: cy + dy * halfExtent,
  };
}

/* Default wall positions — one rect per belt endpoint that actually
 * touches a building wall. Belt 1's bottom (B1-A) and belt 4's exit
 * booth side (B4-B) are intentionally absent: those endpoints open
 * onto the floor / sidewalk rather than into a wall, so they don't
 * need an occluder. */
export const DEFAULT_WALL_RECTS: WallRect[] = [
  { x: 322, y: 171, w: 154, h: 91, slant: -30, label: "B1-B" },
  { x: 440, y: 240, w: 47, h: 132, points: [{ x: 440, y: 240 }, { x: 477, y: 259 }, { x: 550, y: 221 }, { x: 550, y: 289 }, { x: 490, y: 324 }, { x: 487, y: 372 }, { x: 440, y: 372 }], label: "B2-A" },
  { x: 631, y: 312, w: 80, h: 80, label: "B2-B" },
  { x: 754, y: 362, w: 84, h: 97, label: "B3-A" },
  { x: 982, y: 350, w: 93, h: 94, label: "B3-B" },
  { x: 1091, y: 399, w: 80, h: 86, label: "B4-A" },
];

/* Door shadows — separate list from wall masks so each can have
 * its own position, size, slant, and gradient angle. Tuned in the
 * mask calibrator. */
export const DEFAULT_DOOR_SHADOWS: DoorShadow[] = [
  { x: 365, y: 287, w: 74, h: 70, fade: "down", slant: -30, angle: 120, radius: 6, darkness: 0.0, lightness: 1.0, label: "B1-B" },
  { x: 488, y: 325, w: 59, h: 52, fade: "down", slant: 30, angle: 60, radius: 12, darkness: 0.0, lightness: 1.0, label: "B2-A" },
  { x: 838, y: 378, w: 56, h: 67, fade: "down", slant: 30, angle: 60, radius: 12, darkness: 0.0, lightness: 1.0, label: "S3" },
  { x: 1171, y: 401, w: 62, h: 87, fade: "down", slant: 30, angle: 60, radius: 12, darkness: 0.0, lightness: 1.0, label: "S4" },
];

/* Global shadow tuning. All editable live from the calibrator's
 * "Shadow gradient" section, then pasted back here.
 *
 *   opacity   group-level multiplier (0–1) on the whole shadow layer
 *   darkness  stop-opacity at the DARK end of each gradient (0–1)
 *   lightness stop-opacity at the LIGHT end of each gradient (0–1)
 *   midpoint  position of the intermediate stop (0–1). 0.5 = linear;
 *             lower = transition concentrates near the dark end,
 *             higher = transition concentrates near the light end
 *   blend     mix-blend-mode applied to the shadow group ("normal",
 *             "multiply", "screen", "overlay", "darken", etc.)
 */
export const DEFAULT_SHADOW_OPACITY = 1.0;
export const DEFAULT_SHADOW_DARKNESS = 1.0;
export const DEFAULT_SHADOW_LIGHTNESS = 0.0;
export const DEFAULT_SHADOW_MIDPOINT = 0.36;
export type ShadowBlend =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "color-burn"
  | "soft-light"
  | "hard-light";
export const DEFAULT_SHADOW_BLEND: ShadowBlend = "normal";

/* Global default color for the door-shadow gradients. Any CSS color
 * string. Use "white" to flip the effect from "dark shadow falling
 * from above" to "light haze emerging from a doorway". Each
 * DoorShadow can override this per-instance via its own `color`. */
export const DEFAULT_SHADOW_COLOR = "black";

/* Per-card (per-pile) shadow tuning. Controls the ellipse that sits
 * UNDER each pile to ground it on the belt deck. Increase `opacity`
 * + decrease `blur` for a sharper, more grounded shadow. Lower
 * `yOffset` (more negative) tucks the shadow tighter under the pile.
 * `scale` multiplies the ellipse radii; `bloomScale` does the same
 * for the warmer outer halo. */
export type CardShadow = {
  scale?: number;
  /** Extra horizontal stretch on top of `scale` — applies only to
   * rx, leaves ry untouched. 1.0 = no change. */
  width?: number;
  /** Extra vertical stretch on top of `scale` — applies only to
   * ry, leaves rx untouched. Pair with `width` for full
   * independent control over the shadow's aspect ratio. 1.0 = no
   * change. */
  height?: number;
  opacity?: number;
  /** Horizontal nudge of the shadow center, in viewBox units.
   * Positive moves it right relative to the pile's footprint. */
  xOffset?: number;
  yOffset?: number;
  blur?: number;
  bloomScale?: number;
  bloomOpacity?: number;
  contactOpacity?: number;
};

/* One icon stamped on each station's rooftop sign. Loaded from
 * the project's flex-line icon set at /work/messa/hero/icons/flex-line/*.svg
 * (same set product-section + how-section use, so the sign icons
 * match the line iconography elsewhere on the page). Each icon
 * is iso-projected onto the front-face plane of an imagined sign
 * panel.
 *
 * `set` defaults to "flex-line" but can be overridden per-icon if
 * you want a single sign to use a different style.
 *
 * Tune positions/sizes via ?calibrate=masks → the new "Sign
 * icons" section with drag-to-position handles. */
export type SignIcon = {
  x: number;
  y: number;
  size: number;
  /** Icon filename (no .svg extension). For `tabler` set this is
   * a Tabler outline icon name like "file-search"; for the
   * in-project sets it's the filename under /work/messa/hero/icons/<set>/. */
  icon: string;
  /** Icon set. Defaults to "tabler" — the same set the canonical
   * stepData uses, loaded from the jsDelivr CDN. */
  set?: "tabler" | "flex-line" | "flex-duo" | "sharp-duo" | "plump-duo" | "core-solid";
  /** Stroke color for the icon. Tabler outline icons use
   * stroke="currentColor" so this gets piped through via the
   * SVG `color` property. Falls back to MUTED_ACCENT slate. */
  color?: string;
  /** Seconds to hold the icon at opacity=0 before fading in. Used
   * to stagger the scene so each rooftop sign appears as the first
   * conveyor card reaches its building's belt. Omitted = visible
   * from t=0. */
  revealDelay?: number;
  /** Display label for the calibrator panel. */
  label?: string;
  /** Pre-inlined SVG path `d` strings (viewBox 0 0 24 24). When
   * provided, SignIconInline skips the fetch+DOMParser pipeline and
   * renders these directly — avoids iOS Safari async-fetch issues. */
  paths?: string[];
};

/* Brand palette for the rooftop signs — mapped to the journey
 * stages so each stage has its own visual identity:
 *   1. Prepare    → Sage Strong (calm, organised)
 *   2. Interview  → Muted Accent (active, in-conversation)
 *   3. Decide     → Warm Brown Stepper (grounded, decisive)
 * Brown was chosen over the bright accent indigo because the
 * indigo sat too close in hue to the muted-slate Interview color
 * (two blues reading as "stage 2 again") and because the warm
 * brown is already the active-step color in the How-It-Works
 * stepper — same semantic, same swatch. Result is a clean
 * green → slate → brown progression that harmonizes with the
 * cream illustration. Sourced from /brand and /design-system. */
export const SIGN_COLOR_PREPARE  = "#4A7552"; // sage strong
export const SIGN_COLOR_INTERVIEW = "#5A6B8F"; // muted accent
export const SIGN_COLOR_DECIDE   = "#8B6F4E"; // warm brown (stepper)

/* Reveal delays form a tight left-to-right cascade decoupled
 * from the conveyor's belt timing — the building cascade plays
 * out in the first ~5 seconds (1.5/2.5/3.5/5) rather than the
 * previous 2/7/12/17 which stretched across the full 21s pre-roll
 * and felt sluggish. The conveyor still does its own thing
 * underneath; these reveals are purely visual chrome. */
export const DEFAULT_SIGN_ICONS: SignIcon[] = [
  {
    x: 445, y: 88, size: 46, icon: "file-search", color: SIGN_COLOR_PREPARE, revealDelay: 1.5, label: "1. Prepare",
    paths: [
      "M14 3v4a1 1 0 0 0 1 1h4",
      "M12 21h-5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v4.5",
      "M14 17.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0",
      "M18.5 19.5l2.5 2.5",
    ],
  },
  {
    x: 767, y: 130, size: 46, icon: "message", color: SIGN_COLOR_INTERVIEW, revealDelay: 2.5, label: "2. Interview",
    paths: [
      "M8 9h8",
      "M8 13h6",
      "M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12",
    ],
  },
  {
    x: 1122, y: 143, size: 46, icon: "circle-check", color: SIGN_COLOR_DECIDE, revealDelay: 3.5, label: "3. Decide",
    paths: [
      "M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0",
      "M9 12l2 2l4 -4",
    ],
  },
];

/* ── Building-wall text ──
 * Each station gets a stage label + short subtitle printed on the
 * front wall of its building. Like the sign icons, the text is
 * projected onto the iso wall plane (a vertical face) via the same
 * 30° axonometric matrix, so the type slopes down-right with the
 * architecture and reads as painted onto the building.
 *
 * Subtitle is a single string; line breaks inside it (\n) become
 * <tspan>s so a copy can wrap at the intended break.
 *
 * Tune positions/sizes via ?calibrate=masks → Building texts. */
export type BuildingText = {
  x: number;
  y: number;
  title: string;
  subtitle: string;
  /** Title color — defaults to the matching stage color. */
  color?: string;
  /** Title font size in viewBox units. */
  size?: number;
  /** Subtitle font size in viewBox units. When omitted, derives
   * from title size (`size * 0.65`). Set explicitly when you want
   * to scale the title independently of the subtitle — e.g. bump
   * title up without growing the descriptive copy. */
  subtitleSize?: number;
  /** Horizontal alignment of the title + subtitle relative to (x, y).
   *   "left"   — anchor is the top-left, text extends to the right.
   *   "center" — anchor is the top-CENTER, text expands both sides.
   *   "right"  — anchor is the top-right, text extends to the left.
   * Defaults to "left" for backward compatibility. */
  align?: "left" | "center" | "right";
  /** Title typeface.
   *   "sans"  — Messina Sans (current default — modern sans-serif)
   *   "serif" — Perfectly Nineties (brand serif — elegant + slightly
   *             condensed via -0.01em letter-spacing on the title)
   * Subtitle stays sans either way so the descriptive copy remains
   * readable at small sizes against the cream wall. */
  font?: "sans" | "serif";
  /** Seconds to hold the text at opacity=0 before fading in. Used
   * to stagger the scene so each building's title appears as the
   * first conveyor card reaches that building's belt. Omitted =
   * visible from t=0. */
  revealDelay?: number;
  /** Display label for the calibrator panel. */
  label?: string;
};

/* Projection angle (degrees) for the iso plane the rooftop icons,
 * building-wall texts, and ground shadows all share. Set to 26.57°
 * — exact 2:1 dimetric (atan(1/2) ≈ 26.5651°) — which matches the
 * factory PNG's actual building-wall slope. The PNG is drawn in
 * dimetric, not true iso, so this lower angle keeps the text
 * baseline parallel to the building's top edge instead of reading
 * steeper than the architecture. The TextCalibrator's slider still
 * lets you nudge between 25° and 35° at render time if needed. */
export const DEFAULT_WALL_ANGLE_DEG = 26.57;

/* Default positions place the title on the FRONT wall of each
 * building — calibrated via ?calibrate=text. Colors use the
 * named SIGN_COLOR_* constants so the rooftop icon + wall title
 * for each stage stay in sync if the palette changes. */
/* Reveal delays form a tight left-to-right cascade independent
 * of the conveyor's belt timing. Each building's text fades in
 * ~1 second after the previous one, so the whole scene reads its
 * stages quickly (~5s total) instead of waiting for the slow
 * conveyor cards to reach each station. The conveyor still does
 * its own thing underneath — these reveals are pure visual chrome. */
export const DEFAULT_BUILDING_TEXTS: BuildingText[] = [
  { x: 400,  y: 226, title: "1. Prepare",         subtitle: "Summarize &\nget ready",                color: SIGN_COLOR_PREPARE,   size: 31, subtitleSize: 14, align: "center", font: "serif", revealDelay: 1.5, label: "Building 1" },
  { x: 725,  y: 276, title: "2. Interview",       subtitle: "Guide the conversation\nin real time",  color: SIGN_COLOR_INTERVIEW, size: 31, subtitleSize: 14, align: "center", font: "serif", revealDelay: 2.5, label: "Building 2" },
  { x: 1066, y: 289, title: "3. Decide",          subtitle: "Generate scorecards\n& align on evidence", color: SIGN_COLOR_DECIDE,  size: 31, subtitleSize: 14, align: "center", font: "serif", revealDelay: 3.5, label: "Building 3" },
  /* End sign — closes the factory line with a thesis statement.
   * Multi-line title (\n splits into two equally-styled lines),
   * empty subtitle so there's no second typography style. Sits on
   * the small fourth building past the conveyor exit. */
  { x: 1414, y: 247, title: "Decisions based\non evidence",       subtitle: "",                                       color: SIGN_COLOR_DECIDE,    size: 16, subtitleSize: 13, align: "center", font: "serif", revealDelay: 5,   label: "End sign" },
];

/* ── Intro sign ──
 * A standing signpost at the LEFT entrance of the factory that
 * shows the Messa logo and the ingredients fed into the production
 * line (resume + job description + company context + role &
 * rubric). Sits on the iso wall plane like the rest of the painted
 * signage. Tune via ?calibrate=text → Intro sign. */
export type IntroSignItem = {
  /** Tabler outline icon name (resolved via the SignIconInline pipeline). */
  icon: string;
  /** Stroke color for the icon — should be a brand swatch. */
  color: string;
  /** Label text shown to the right of the icon. */
  label: string;
};

export type IntroSign = {
  x: number;
  y: number;
  /** Uniform scale applied after the iso wall matrix. 1 = native size. */
  scale: number;
  /** Wordmark + icon colors. */
  logoColor: string;
  logoIconColor: string;
  /** Logo height in viewBox units (before scale). */
  logoHeight: number;
  /** Gap between logo and first item row. */
  logoGap: number;
  /** Icon size for each row (in viewBox units, before scale). */
  iconSize: number;
  /** Vertical spacing between item rows. */
  rowGap: number;
  /** Horizontal gap between an icon and its label. */
  iconLabelGap: number;
  /** Label font size. */
  labelSize: number;
  /** Label color. */
  labelColor: string;
  /** Label typeface — toggle for serif vs sans A/B testing. */
  labelFont: "sans" | "serif";
  /** Seconds to hold the sign at opacity=0 before fading in. Use
   * 0 (or omit) to have it visible from page load — the intro
   * sign is typically the first element visible. */
  revealDelay?: number;
  /** Display label for the calibrator panel. */
  label?: string;
  /** Item rows. */
  items: IntroSignItem[];
};

/* ── Sidewalk shadow ──
 * A subtle gradient parallelogram hugging the bottom edge of the
 * factory sidewalk. Fades from a warm dark color at the top edge
 * (touching the sidewalk) to transparent below, giving the
 * illustration a slight lift off the page.
 *
 * The slope is measured from the factory-blank.png — the sidewalk
 * bottom edge runs from (55, 528) on the left up to (1555, 478)
 * on the right, a -0.033 ratio (≈1.9°). Much shallower than the
 * building walls (26.57° dimetric) because the sidewalk is a
 * horizontal ground plane viewed at a shallow angle, not a
 * vertical face. */
export type SidewalkShadow = {
  /** Top-left of the shadow polygon. The polygon's TOP edge hugs
   * the bottom edge of the sidewalk. */
  x: number;
  y: number;
  /** Horizontal extent in viewBox units. */
  width: number;
  /** Vertical extent (top to bottom of the gradient band). */
  height: number;
  /** Slope of the top edge (dy/dx). Negative = top goes UP-right.
   * Use `shapeAngleDeg` for a more intuitive override. */
  slope: number;
  /** Shape's top-edge angle in degrees (positive = sloping
   * DOWN-right). When set, overrides `slope` via tan(angleDeg).
   * Lets you set "30° iso" once instead of dialing in 0.577. */
  shapeAngleDeg?: number;
  /** Gradient direction in degrees, measured clockwise from
   * straight-down: 0° = top-to-bottom (default), 90° = left-to-
   * right, -90° = right-to-left. Useful when the shape's slope
   * differs from the gradient's natural fade axis. */
  gradientAngleDeg?: number;
  /** Shadow color (a warm dark reads well on the cream illustration). */
  color: string;
  /** Peak opacity at the top edge (faded to 0 at the bottom). */
  opacity: number;
  /** Display label for the calibrator panel. */
  label?: string;
};

export const DEFAULT_SIDEWALK_SHADOW: SidewalkShadow = {
  /* Single-instance default kept for backward compatibility; the
   * canonical export is now DEFAULT_SIDEWALK_SHADOWS below
   * (array form so you can stack multiple ground-shadow bands). */
  x: 12,
  y: 536,
  width: 150,
  height: 32,
  slope: 0.2,
  color: "#2A1F12",
  /* Bumped 0.22 → 0.40 so the gradient registers against cream
   * (was reading nearly indistinguishable from the sidewalk
   * background at peak). The gradient fades to 0 at the bottom
   * regardless, so it stays a soft band, just darker at the top. */
  opacity: 0.4,
};

/* Five sidewalk shadows distributed along the factory base, each
 * with a 30° iso slope (shapeAngleDeg: 30 → slope ≈ 0.577) so the
 * shadow's top edge cuts down-right at the same angle as the
 * truck and iso architecture. The shadows are spaced ≈300 viewBox
 * units apart and slightly offset in y to follow the sidewalk's
 * own gentle perspective drift. Calibrate via ?calibrate=text →
 * rose panel; the slope value is recomputed from shapeAngleDeg
 * automatically when set. */
/* SidewalkShadow array intentionally empty now — the actual 5
 * sidewalk shadows live in DEFAULT_ISO_RECTS as iso rhombuses
 * (they look better than slanted bands, and they render behind
 * the PNG via the dedicated shadow-background <svg> layer). The
 * type + calibrator section stay around so you can add gradient
 * bands later if needed. */
export const DEFAULT_SIDEWALK_SHADOWS: SidewalkShadow[] = [];

/* ── Iso ground rectangles ──
 * Flat tiles drawn on the ground plane (not the wall plane) at
 * the standard iso 2:1 dimetric angle. Each rect projects from
 * a centered world-space (width × depth) into a screen-space
 * parallelogram:
 *
 *   +X (world) → screen (cos θ,  sin θ)   — down-right
 *   +Y (world) → screen (-cos θ, sin θ)   — down-left
 *
 * The 4 corners form a diamond/rhombus. Use cases: a parking pad
 * under the truck, a "shipping zone" highlight, a decorative
 * floor marker. Color is a single solid fill; opacity lets you
 * dial in how prominent the tile reads. */
export type IsoRect = {
  /** Center in viewBox units (the pad's middle). */
  x: number;
  y: number;
  /** Length along world +X axis (long iso diagonal goes down-right). */
  widthX: number;
  /** Length along world +Y axis (long iso diagonal goes down-left). */
  depthY: number;
  color: string;
  opacity: number;
  /** Optional outline. */
  borderColor?: string;
  borderWidth?: number;
  /** Override the iso angle (degrees). Defaults to wallAngleDeg
   * so the pad matches the buildings' projection, but some
   * illustrations draw vehicles at a slightly different angle —
   * setting this per-rect lets you align the pad's diamond with
   * the truck's actual footprint without affecting the rest. */
  angleDeg?: number;
  /** Gaussian blur radius (viewBox units). 0 or omitted = sharp
   * parallelogram edges. Higher values soften the rect into a
   * natural-looking cast shadow. The filter region is expanded
   * to fit so the blur doesn't clip at the bbox. */
  blur?: number;
  /** Entrance translate animation (same idea as FloatingImage):
   * the rect starts at (enterFromX, enterFromY) offset relative
   * to its final (x, y) and animates back to 0 with ease-out
   * over enterDuration, then freezes. Use the SAME values as the
   * truck FloatingImage to make the shadow visually grouped — the
   * two elements aren't in the same <g>, but with identical
   * timing + offsets they move as one. */
  enterFromX?: number;
  enterFromY?: number;
  enterDuration?: number;
  enterDelay?: number;
  /** When true, the entrance loops as a round-trip cycle: arrive →
   * dwell at dock → drive back out → wait → repeat. Used to keep
   * a shadow synced with a parent FloatingImage that has roundTrip
   * set. Use IDENTICAL roundTrip/dwellDuration/offDuration/enter*
   * values on both so the two SMIL clocks run in lockstep. */
  roundTrip?: boolean;
  /** Seconds the rect dwells at its docked position before the
   * exit translate begins. Only used when roundTrip=true. Defaults
   * to 5. Match the parent truck's dwellDuration. */
  dwellDuration?: number;
  /** Seconds the rect waits offscreen between the exit motion and
   * the next cycle's entrance. Only used when roundTrip=true.
   * Defaults to 3. Match the parent truck's offDuration. */
  offDuration?: number;
  /** When true, the rect is held at opacity=0 during enterDelay,
   * then fades in to its configured fillOpacity over the first
   * half of the entrance animation. Use this for shadows that
   * shouldn't be visible BEFORE their associated object arrives —
   * e.g. the exit truck shadow with a 17s delay would otherwise
   * sit visibly at its offset start position for the entire pre-
   * roll. Defaults to false (the shadow is statically visible at
   * its offset position throughout). */
  enterFade?: boolean;
  /** Seconds to hold the rect at opacity=0 before fading in.
   * Independent of the enter* motion fields — use this when the
   * rect should simply appear at its docked position with no
   * translate animation (e.g. matching the exit truck's fade-in
   * arrival without a slide). Omitted = visible from t=0. */
  revealDelay?: number;
  /** Custom polygon vertices in viewBox coords. When set, the
   * polygon is rendered from these points and widthX/depthY/
   * angleDeg are ignored at render time (they still seed the
   * initial points if you switch INTO vector mode mid-edit).
   * Length is typically 4 (the iso rhombus corners: top, right,
   * bottom, left) but can be 3+ for arbitrary polygon shapes.
   * Each point is [x, y]. */
  points?: [number, number][];
  /** Display label for the calibrator. */
  label?: string;
};

export const DEFAULT_TRUCK_PAD: IsoRect = {
  /* angleDeg: 30 — matches the truck.png cargo-box top edge
   * (measured: slope 0.547-0.583, atan ≈ 29°, true isometric).
   *
   * Position: center at the truck's ground-contact point
   * (truck top-left 341,514 + size 295×229 → wheels touch
   * ground at y = 514+229 = 743). The diamond extends around
   * this center — its upper portion sits behind the truck
   * silhouette (z-ordered under) and the lower/side portions
   * peek out as the visible cast shadow.
   *
   * Hard rectangle for now to lock in placement; next pass
   * swaps for a radial soft-fade so the edges feather. */
  /* angleDeg removed — inherits the global wallAngleDeg (26.57°,
   * factory's measured 2:1 dimetric). Now ALL ground shadows use
   * the same iso angle for a unified projection across the scene. */
  x: 465,
  y: 687,
  widthX: 211,
  depthY: 66,
  color: "#2A1F12",
  /* opacity + blur calibrated soft: 0.29 fillOpacity at blur 10.5
   * gives a diffuse, low-density shadow that reads more like
   * ambient occlusion than a hard cast shadow. Tweak the values
   * in ?calibrate=text → IsoRect panel. */
  opacity: 0.29,
  borderWidth: 0,
  blur: 10.5,
  /* Match the truck FloatingImage's entrance + round-trip cycle
   * EXACTLY — the two elements live in separate <g> nodes but
   * identical SMIL timing + offsets + cycle config keep them
   * visually grouped as the truck backs up, dwells, drives off,
   * and loops. If any value drifts (enterDuration, dwellDuration,
   * offDuration, enterFromX/Y, enterDelay) the shadow will trail
   * or lead the truck during the cycle. */
  enterFromX: 120,
  enterFromY: 69,
  enterDuration: 8,
  enterDelay: 0.4,
  roundTrip: true,
  dwellDuration: 6,
  offDuration: 3,
  label: "Truck shadow",
};

/* Shadow under the SECOND truck (Decisions Out) parked at the
 * right end of the conveyor. Mirrors DEFAULT_TRUCK_PAD's geometry
 * but anchored to the right-end truck position.
 *
 * No alpha fade — the shadow sits visibly at its offset start
 * position from t=0 and slowly creeps up-left into final position
 * across the entire 21-second pre-roll. The slow-and-steady motion
 * over the whole window replaces the prior "wait, then fade in
 * mid-motion" approach which read as a magical apparition; now
 * the truck is always physically present and just takes its time
 * docking, arriving exactly when the first paper exits belt 4. */
export const DEFAULT_TRUCK_PAD_OUT: IsoRect = {
  x: 1301,
  y: 699,
  widthX: 211,
  depthY: 66,
  color: "#2A1F12",
  /* Lighter than the entrance truck shadow (0.16 vs 0.29) but
   * slightly less blurred (8.5 vs 10.5) — reads as a more compact,
   * lower-density pool of shade on the exit-side sidewalk. */
  opacity: 0.16,
  borderWidth: 0,
  blur: 8.5,
  /* Matches the exit truck FloatingImage's entrance + round-trip
   * cycle EXACTLY — same 500 × 289 offset (iso 30° axis), same
   * 14s drive, 6s dwell, 14s back, 3s off cycle. Any drift in
   * these numbers vs. the truck above = visible separation between
   * truck and shadow during motion. revealDelay:5 holds fill-
   * opacity=0 until t=5 so the shadow only appears on the first
   * arrival; once visible it stays visible across all subsequent
   * cycles (the translate moves it offscreen with the truck during
   * the off-phase, so no need to re-hide it). */
  enterFromX: 500,
  enterFromY: 289,
  enterDuration: 14,
  enterDelay: 5,
  revealDelay: 5,
  roundTrip: true,
  dwellDuration: 6,
  offDuration: 3,
  label: "Truck shadow (out)",
};

/* Default iso rects = truck shadow + 5 sidewalk shadows distributed
 * along the factory base. Each is an iso ground rhombus (4-point
 * diamond, not a slanted band) at the truck's same 30° iso angle.
 * Positions calibrated via ?calibrate=text → orange panel; staggered
 * y values follow the sidewalk's slight perspective drift. */
/* Sidewalk shadows: angleDeg omitted so each rect inherits the
 * global wallAngleDeg (26.57°, the factory's 2:1 dimetric measured
 * from the PNG). That matches the building wall slopes — shadows
 * cast at the same angle as the architecture they're under.
 *
 * Truck shadow stays at 30° (matches the truck PNG's own iso
 * angle, which is measured at ~29° → rounded to true 30° iso). */
/* All sidewalk shadows are now ISO SQUARES — widthX = depthY so
 * the projection is an equilateral rhombus with all 4 edges the
 * same length, 60° at top/bottom vertices, 120° at left/right.
 * That's a textbook iso-square projection, which is what the user
 * was asking for. Sizes averaged from their previous widthX/depthY
 * so the overall footprint stays close to where they had calibrated. */
/* Sidewalk shadows in VECTOR mode — each has custom 4-point
 * polygon corners (calibrated via the per-vertex drag handles in
 * ?calibrate=text). The points override the auto-rhombus shape,
 * letting each shadow follow the exact footprint of whatever
 * building/object it sits under. */
/* The 5 sidewalk ground-shadow rhombi, split out from the truck
 * pads so the case-study factory can gate the two halves on
 * DIFFERENT toggles. Ground shadows follow the Shadows toggle; the
 * truck pads (DEFAULT_TRUCK_PAD / _OUT) follow BOTH Shadows AND
 * Trucks — a truck shadow sliding across empty pavement with no
 * truck above it (Trucks off, Shadows on) reads as broken, and the
 * two are one logical object (the pad's SMIL timing is duplicated
 * verbatim from the truck FloatingImage to stay glued to it). */
export const DEFAULT_GROUND_SHADOWS: IsoRect[] = [
  { x:  320, y: 526, widthX: 248, depthY: 248, color: "#2A1F12", opacity: 0.14, blur: 8, points: [[346, 278], [438, 493], [237, 654], [2, 499]],                  label: "Sidewalk shadow 1" },
  { x:  415, y: 553, widthX: 100, depthY: 100, color: "#2A1F12", opacity: 0.15, blur: 8, points: [[417, 509], [627, 483], [444, 615], [345, 566]],                label: "Sidewalk shadow 2" },
  { x:  834, y: 501, widthX: 265, depthY: 265, color: "#2A1F12", opacity: 0.14, blur: 8, points: [[819, 355], [1048, 497], [847, 655], [589, 509]],               label: "Sidewalk shadow 3" },
  { x: 1180, y: 550, widthX: 213, depthY: 213, color: "#2A1F12", opacity: 0.16, blur: 6, points: [[1134, 417], [1331, 519], [1171, 640], [993, 542]],             label: "Sidewalk shadow 4" },
  { x: 1347, y: 563, widthX: 232, depthY: 232, color: "#2A1F12", opacity: 0.13, blur: 8, points: [[1382, 341], [1616, 442], [1355, 680], [1154, 564]],            label: "Sidewalk shadow 5" },
];

/* Full default set for the standalone hero: both truck pads FIRST
 * (so the ground shadows stack above them where they overlap),
 * then the sidewalk shadows. The case-study composes these from the
 * parts instead so it can gate the truck pads independently. */
export const DEFAULT_ISO_RECTS: IsoRect[] = [
  DEFAULT_TRUCK_PAD,
  DEFAULT_TRUCK_PAD_OUT,
  ...DEFAULT_GROUND_SHADOWS,
];

/* ── Floating images ──
 * Static iso-style illustrations overlaid on the factory at a
 * fixed position with a gentle bob animation. Used for "in-product"
 * snippets attached to specific stages — e.g. the leaderboard
 * scorecard sitting below Building 3's subtitle to show what
 * "Decide" produces.
 *
 * Position + size are in viewBox units (NOT iso-projected — the
 * source PNG should already be drawn in the illustration's
 * perspective). The bob is a translate-Y SMIL animation that
 * loops forever; calcMode="spline" gives an ease-in-out so the
 * motion feels weightless rather than ticking. */
export type FloatingImage = {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Public URL of the image (e.g. "/work/messa/hero/leaderboard.png"). */
  src: string;
  /** Float amplitude in viewBox units (peak displacement from rest). */
  floatAmplitude?: number;
  /** One full up-and-down cycle in seconds. */
  floatDuration?: number;
  /** Phase offset in seconds — stagger this if you ever render
   * multiple images so they don't all bob in lockstep. */
  floatDelay?: number;
  /** Entrance motion — one-shot translate played at page load.
   * The image starts at (enterFromX, enterFromY) offset from its
   * final (x, y) and animates toward 0,0 with a smooth ease-out,
   * then freezes at the final position via fill="freeze". Use a
   * positive enterFromX/Y to make the image appear "forward of"
   * its final spot (the truck backing up is a classic example:
   * truck starts down-right of final, settles up-left). */
  enterFromX?: number;
  enterFromY?: number;
  /** Entrance duration in seconds (default 3.5). */
  enterDuration?: number;
  /** Delay before the entrance animation begins (default 0). */
  enterDelay?: number;
  /** Whether to also fade in (opacity 0 → 1) during the first
   * half of the entrance. Defaults to true. */
  enterFade?: boolean;
  /** Optional label rendered alongside the image. Lives inside the
   * same <g> as the image so it inherits any entrance + bob
   * animation. Use for in-illustration callouts like "CVs In" on
   * the truck. */
  text?: {
    content: string;
    /** Offset from the image's top-left in viewBox units. */
    offsetX: number;
    offsetY: number;
    fontSize: number;
    color: string;
    fontWeight?: number;
    fontFamily?: "sans" | "serif";
    align?: "left" | "center" | "right";
    letterSpacing?: string;
    /** Rotation around the text's own anchor, degrees. */
    rotateDeg?: number;
    /** Iso-wall projection angle in degrees. When set, the text
     * wraps in a matrix(cos θ, sin θ, 0, 1, anchor.x, anchor.y)
     * so it lays on a vertical wall surface — same projection
     * the building-wall texts use. Useful for labels painted on
     * the side of a vehicle (e.g. "CVs In" on the truck's
     * cargo panel). Omit for axis-aligned (horizontal) text. */
    wallAngleDeg?: number;
  };
  /** Seconds to hold the image at opacity=0 before fading in.
   * Independent of enterFade (which is tied to the entrance
   * translate). Used for non-truck images like the Interview /
   * Leaderboard panels that need to appear when the conveyor
   * cards reach their building. Omitted = visible from t=0. */
  revealDelay?: number;
  /** ROUND-TRIP loop. When true, the entrance animation extends
   * into a continuous cycle:  arrive at dock  →  stay docked for
   * `dwellDuration` seconds  →  drive back to the off-screen
   * starting position  →  wait `offDuration` seconds  →  repeat.
   * Used for the trucks: client wanted "que el camioncito vaya y
   * vuelva, no solo que entre." Without this flag the truck just
   * docks once and freezes (legacy behaviour for other floating
   * images that should stay put). */
  roundTrip?: boolean;
  /** How long the image holds at its docked position before the
   * exit animation starts. Only relevant when `roundTrip` is true.
   * Defaults to 5 seconds. */
  dwellDuration?: number;
  /** How long the image stays off-screen between cycles. Only
   * relevant when `roundTrip` is true. Defaults to 3 seconds. */
  offDuration?: number;
  /** Display label for the calibrator panel. */
  label?: string;
  /** Render animated rising-smoke SVG puffs above the image.
   * Three staggered circles drift upward, expand, and fade out.
   * Used for the coffee mug on the interview-building table. */
  smoke?: boolean;
  /** Mirror the image horizontally around its own centre. */
  flipX?: boolean;
  /** Render a small grounding shadow under the image — the same warm
   * blurred-ellipse + soft bloom the conveyor box piles use, scaled to
   * the image's footprint. */
  shadow?: boolean;
};

export const DEFAULT_FLOATING_IMAGES: FloatingImage[] = [
  /* Box truck parked near the left edge of the illustration,
   * close to where the conveyor line starts — reads as "candidates
   * arriving" at the factory entrance. Static idle (no bob), but
   * plays a one-shot back-up entrance on page load: starts offset
   * forward (down-right in screen space, since truck +X is the
   * iso forward direction) and settles to its final spot. */
  {
    x: 346,
    y: 516,
    width: 295,
    height: 229,
    src: "/work/messa/hero/truck.png",
    floatAmplitude: 0,
    /* +X forward in iso 30° = (cos 30°, sin 30°) on screen.
     * Backing up 139 world units → start offset (120, 69).
     * Animates from there back to (0, 0) over 14s — very slow
     * settling per latest direction ("backup but very slowly").
     * enterFade off so the truck is fully visible the whole way;
     * the motion alone carries the entrance. */
    enterFromX: 120,
    enterFromY: 69,
    enterDuration: 8,
    enterDelay: 0.4,
    enterFade: false,
    /* Round-trip cycle: drives in over 8s, dwells docked for 6s,
     * drives out (reverse, same 8s), waits 3s off-screen, repeats.
     * Total cycle ~25s (8+6+8+3). Client: "que el camioncito vaya
     * y vuelva, no solo que entre." */
    roundTrip: true,
    dwellDuration: 6,
    offDuration: 3,
    /* "CVs In" label painted on the truck's cargo side panel.
     * Lives inside the same <g> as the image so it rides the
     * back-up animation, and uses wallAngleDeg: 30 (matching
     * the truck's iso angle) so the type lays on the side panel
     * like signage instead of floating axis-aligned. Serif for
     * a hand-painted-truck-letterwork feel. */
    text: {
      content: "CVs In",
      offsetX: 60,
      offsetY: 110,
      fontSize: 30,
      color: "#1F1A14",
      fontWeight: 600,
      fontFamily: "serif",
      letterSpacing: "0em",
      wallAngleDeg: 30,
    },
    label: "Truck (entrance)",
  },
  /* Box truck parked at the RIGHT end of the conveyor, where
   * processed CVs (decisions) leave the factory. Visually mirrors
   * the entrance truck — same PNG, same backing-up entrance, but
   * positioned so its cargo opening aligns with belt 4's exit
   * point at (1278, 510). Papers reaching the end of belt 4
   * appear to slide INTO the truck's open cargo bay.
   *
   * Timing: belt 4's first card arrives at t=21s (sum of belt
   * durations 7+5+5+4). Truck animation runs t=17→23, so the
   * truck is mid-back-up when the first paper arrives (about 67%
   * through its motion). Subsequent papers (t=22, 23, 24) feed
   * into the truck as it finishes settling and goes stationary. */
  {
    /* Cargo opening offset from truck top-left in first truck is
     * (96, -18) — measured from belt 1 start (442, 498) vs truck
     * (346, 516). Aligning that opening with belt 4 end (1278, 510)
     * places this truck's top-left at (1182, 528). */
    x: 1182,
    y: 528,
    width: 295,
    height: 229,
    src: "/work/messa/hero/truck.png",
    floatAmplitude: 0,
    /* Synchronized with the End sign's compressed reveal at t=5
     * — both appear with the rest of the building cascade rather
     * than waiting for the conveyor's belt 4 to fill.
     *
     * Motion: 500 × 289 offset along the iso 30° axis
     * (tan(30°) ≈ 0.5774, so 500 × 0.5774 = 289). The big offset
     * is intentional — at 120 the truck only nudged sideways
     * inside the viewBox. At 500 the truck's LEFT edge
     * (dock x=1182 + 500 = 1682) clears the viewBox right edge
     * (1614), so the truck genuinely starts off-screen on the
     * very first arrival AND leaves the screen during every
     * subsequent off-phase.
     *
     * Speed shape: 14s with the ease-out-quint spline
     * (0.16 1 0.3 1) covers ~83% of the distance in the first
     * 30% of the duration, then crawls the final 17% over 9.8s.
     * That's the "back up slower as it gets to the dock" feel —
     * fast approach, then deliberate creep into position. */
    enterFromX: 500,
    enterFromY: 289,
    enterDuration: 14,
    enterDelay: 5,
    enterFade: false,
    revealDelay: 5,
    /* Round-trip cycle — drives in 14s, dwells 6s, drives out 14s,
     * waits 3s, repeats. Cycle total 37s. enterDelay:5 makes the
     * first arrival land at t=19, still well before belt 4's first
     * cards reach the dock at t=21. */
    roundTrip: true,
    dwellDuration: 6,
    offDuration: 3,
    /* "Decisions Out" painted on the cargo side panel — same wall
     * projection (30°) and styling as "CVs In" on the entrance truck.
     * Smaller fontSize (20 vs 30) to fit the longer copy on the
     * same panel without overrunning the cargo box edge.
     *
     * RIGHT-aligned with anchor at (175, 105) so the text's END
     * (rightmost character) sits at the cargo-cab junction and the
     * text extends BACKWARD (up-left in iso) toward the cargo back
     * wall. The previous left-aligned approach with offsetY:132
     * dropped the text's far end below the cargo box (into the
     * wheels region) because iso projection drags every character
     * down-right; right-anchoring at the cab side keeps the entire
     * string on the cargo panel since the start of the text is the
     * HIGHEST point of the iso-projected baseline.
     *
     * Truck PNG layout (295 × 229 viewBox units):
     *   cargo box side panel ≈ local (15, 5)–(200, 170)
     *   cab + windows       ≈ local (200, 60)–(285, 200)
     *   wheels              ≈ local (0, 170)–(285, 229)
     * Anchor (143, 151), fontSize 23 — calibrated via the fuchsia
     * text handle in ?calibrate=text. With right-align, the text
     * END sits at local (143, 151) and the text START lands near
     * the cargo back wall, centering "Decisions Out" along the
     * cargo side at a slightly larger size for legibility. */
    text: {
      content: "Decisions Out",
      offsetX: 143,
      offsetY: 151,
      fontSize: 23,
      color: "#1F1A14",
      fontWeight: 600,
      fontFamily: "serif",
      letterSpacing: "0em",
      align: "right",
      wallAngleDeg: 30,
    },
    label: "Truck out (exit)",
  },
  /* Interview scene sitting below Building 2's subtitle. Iso PNG
   * of two people at a desk with the candidate profile on screen.
   * Calibrated to a slightly-wider-than-tall footprint (228×222)
   * that matches the native PNG aspect. revealDelay:2.5 matches
   * Building 2's compressed reveal timing. */
  {
    x: 608,
    y: 332,
    width: 228,
    height: 222,
    src: "/work/messa/hero/interview.png",
    /* Static — the interview scene reads as a moment captured in
     * progress, so it shouldn't drift. The leaderboard below
     * Building 3 is the only one that needs the bob. */
    floatAmplitude: 0,
    revealDelay: 2.5,
    label: "Interview (B2)",
  },
  /* Leaderboard / scorecard panel sitting below Building 3's
   * subtitle. Native PNG is already drawn iso, so no projection
   * matrix — just place at (x, y). Calibrated to a square 207×207
   * footprint anchored under the Decide title. revealDelay:3.5
   * matches Building 3's compressed reveal timing. */
  {
    x: 959,
    y: 321,
    width: 207,
    height: 207,
    src: "/work/messa/hero/leaderboard.png",
    floatAmplitude: 4,
    floatDuration: 4.5,
    floatDelay: 0,
    revealDelay: 3.5,
    label: "Leaderboard (B3)",
  },
  /* Single person reading a CV — calibrated to sit near the left
   * end of the conveyor at human scale (70 × 179, portrait).
   * revealDelay:1.5 matches Building 1's compressed reveal. */
  {
    x: 270,
    y: 504,
    width: 70,
    height: 179,
    src: "/work/messa/hero/single.webp",
    floatAmplitude: 0,
    revealDelay: 1.5,
    label: "Single CV",
  },
  /* Group of four people discussing a CV — calibrated to sit near
   * the right end of the conveyor (115 × 199, slightly portrait).
   * revealDelay:5 matches the End sign's compressed reveal. */
  {
    x: 1321,
    y: 423,
    width: 115,
    height: 199,
    src: "/work/messa/hero/group.webp",
    floatAmplitude: 0,
    revealDelay: 5,
    label: "Group interview",
  },
  /* Coffee mug on the interview-building table. Appears when Building 2
   * reveals (revealDelay:2.5) and emits SMIL steam puffs above the mug.
   * Position and scale calibrated via ?calibrate=coffee. */
  {
    x: 744,
    y: 444,
    width: 20,
    height: 24,
    src: "/work/messa/hero/coffee.png",
    floatAmplitude: 0,
    revealDelay: 2.5,
    smoke: true,
    shadow: true,
    label: "Coffee Mug (B2 table)",
  },
  {
    x: 697,
    y: 424,
    width: 20,
    height: 24,
    src: "/work/messa/hero/coffee.png",
    floatAmplitude: 0,
    revealDelay: 2.5,
    smoke: true,
    flipX: true,
    shadow: true,
    label: "Coffee Mug 2 (B2 table, flipped)",
  },
];

export const DEFAULT_INTRO_SIGN: IntroSign = {
  /* Calibrated via ?calibrate=text → Intro sign. Sits on the
   * standing signboard at the left edge of the factory. */
  x: 87,
  y: 263,
  scale: 0.6,
  logoColor: "#0A0A0B",          // brand text-primary
  logoIconColor: SIGN_COLOR_INTERVIEW, // matches the muted-slate iso M
  logoHeight: 47,
  logoGap: 36,
  iconSize: 30,
  rowGap: 57,
  iconLabelGap: 15,
  labelSize: 19,
  labelColor: "#1F1A14",
  labelFont: "sans",
  /* Triggers the hand-drawn intro animation:
   *   t=0.3s   — iso M starts drawing (outline first, then fill)
   *   t=0.45s  — wordmark "essa" starts drawing (0.15s after M)
   *   t=2.05s  — first item row's icon starts drawing
   *   t=2.23s  — second item row, then +0.18s per row
   * Full sequence completes around t≈3.0s, well before the first
   * conveyor card emerges from belt 1 onto the truck dock area. */
  revealDelay: 0.3,
  items: [
    { icon: "file-text",      color: SIGN_COLOR_PREPARE,   label: "Resume" },
    { icon: "square-check",   color: SIGN_COLOR_PREPARE,   label: "Job description" },
    { icon: "target",         color: SIGN_COLOR_INTERVIEW, label: "Company context" },
    { icon: "clipboard-list", color: "#6E5A9F",            label: "Role & rubric" },
  ],
};

/* Resolve a SignIcon to its full SVG URL. ALL icon sets now resolve
 * to local files under /work/messa/hero/icons/<set>/ — including tabler. PERF: we
 * previously fetched tabler icons from cdn.jsdelivr.net at runtime,
 * which added a separate HTTPS handshake per icon (~150-400ms each
 * on mobile). With 7+ icons firing concurrently during initial
 * hydration, that stacked into ~1-2s of serial latency on the LCP
 * critical path. The 7 SVGs we actually use are now committed under
 * /public/work/messa/hero/icons/tabler/ and load from the same origin as the HTML —
 * no extra DNS / TLS handshakes. */
export function signIconUrl(s: SignIcon): string {
  const set = s.set ?? "tabler";
  return `/work/messa/hero/icons/${set}/${s.icon}.svg`;
}

/* ── Sign icon SVG-text cache ──
 * Tabler icons use stroke="currentColor". To tint them with a brand
 * color we fetch the SVG once, substitute "currentColor" for the
 * desired hex, and embed the result as a data: URL in an <image>
 * element. This sidesteps the React/innerHTML SVG-namespace trap
 * (where injected <path> nodes lose their SVG identity and fall
 * back to a black HTML fill).
 *
 * The cache key is just the source URL — color is applied at
 * render time so the same fetched text drives any color. */
const signSvgTextCache = new Map<string, string>();

/* Subscriber registry that turns the cache into a proper external
 * store for useSyncExternalStore: each mounted SignIconInline
 * registers a callback, and a completed fetch notifies them all so
 * any instance waiting on that URL re-reads its snapshot. Instances
 * whose snapshot value is unchanged bail out without re-rendering
 * (useSyncExternalStore compares snapshots with Object.is, and the
 * Map hands back the same string instance every time). */
const signSvgCacheSubscribers = new Set<() => void>();
const subscribeSignSvgCache = (onStoreChange: () => void) => {
  signSvgCacheSubscribers.add(onStoreChange);
  return () => {
    signSvgCacheSubscribers.delete(onStoreChange);
  };
};

/* Parse the SVG text once and pull out the path `d` attributes
 * plus the source viewBox. Returns null on parse failure (e.g.
 * during SSR where DOMParser isn't available). Skips the Tabler
 * placeholder rect (stroke="none" first path) so it doesn't
 * render as a visible square underneath the icon. */
function parseIconPaths(
  svgText: string,
): { viewBox: string; paths: string[] } | null {
  if (typeof window === "undefined") return null;
  try {
    const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    const root = doc.documentElement;
    const viewBox = root.getAttribute("viewBox") ?? "0 0 24 24";
    const paths = Array.from(doc.querySelectorAll("path"))
      .filter((p) => p.getAttribute("stroke") !== "none")
      .map((p) => p.getAttribute("d") ?? "")
      .filter((d) => d.length > 0);
    return { viewBox, paths };
  } catch {
    return null;
  }
}

const SignIconInline = ({
  url,
  color,
  size,
  revealDelay: _revealDelay,
  inlinedPaths,
}: {
  url: string;
  color: string;
  size: number;
  revealDelay?: number;
  /** Pre-extracted path `d` strings (viewBox 0 0 24 24). When
   * provided the fetch+DOMParser pipeline is skipped entirely so
   * the icon renders synchronously on first paint — fixes iOS
   * Safari where async fetch inside a nested SVG can silently
   * fail to update state. */
  inlinedPaths?: string[];
}) => {
  /* The cache doubles as an external store: render reads the current
   * entry via useSyncExternalStore (skipping the cache entirely when
   * paths are inlined, as before), and the fetch effect below writes
   * the entry then notifies subscribers instead of holding local
   * state — keeping the effect body free of synchronous setState
   * calls. The server snapshot is null: the cache is only ever
   * filled client-side, so server-rendered output is unchanged. */
  const svgText = useSyncExternalStore(
    subscribeSignSvgCache,
    () => (inlinedPaths ? null : (signSvgTextCache.get(url) ?? null)),
    () => null,
  );

  useEffect(() => {
    if (inlinedPaths) return; // no fetch needed
    if (signSvgTextCache.has(url)) return; // snapshot already serves it
    let cancelled = false;
    fetch(url)
      .then((r) => r.text())
      .then((text) => {
        if (cancelled) return;
        signSvgTextCache.set(url, text);
        signSvgCacheSubscribers.forEach((notify) => notify());
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [url, inlinedPaths]);

  const parsed = useMemo(
    () => (svgText ? parseIconPaths(svgText) : null),
    [svgText],
  );

  /* Use inlined paths immediately (no async); fall back to fetched paths. */
  const activePaths: string[] | null = inlinedPaths ?? parsed?.paths ?? null;
  if (!activePaths) return null;

  /* All tabler icons use "0 0 24 24"; inlined paths assume this. */
  const viewBox = (inlinedPaths ? null : parsed?.viewBox) ?? "0 0 24 24";
  const vbParts = viewBox.split(/\s+/).map(Number);
  const vbW = vbParts[2] ?? 24;
  const iconScale = size / vbW;
  /* Single-matrix render: no CSS animation, no extra <g> wrappers.
   * CSS `animation` on SVG <g> triggers WebKit GPU compositing;
   * composited layers inside matrix-transformed parents silently
   * vanish on iOS Safari/Chrome. Mirrors the <text> element pattern
   * that already works. */
  return (
    <g transform={`matrix(${iconScale},0,0,${iconScale},${-size / 2},${-size / 2})`}>
      {activePaths.map((d: string, i: number) => (
        <path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
    </g>
  );
};

export const DEFAULT_CARD_SHADOW: Required<CardShadow> = {
  scale: 0.65,
  width: 0.95,
  height: 1.1,
  opacity: 0.94,
  xOffset: -3.5,
  yOffset: -7.0,
  blur: 3.6,
  bloomScale: 1.15,
  bloomOpacity: 1.5,
  /* contactOpacity = 0 disables the tight unblurred core. */
  contactOpacity: 0.0,
};

/* Convert a WallRect to its (x,y) corner points.
 *
 * If `points` is set (≥3 entries) the mask is in custom polygon
 * mode — return those points verbatim and ignore x/y/w/h/slant.
 *
 * Otherwise: for slant === 0 (or undefined) return the four rect
 * corners; for slant ≠ 0 shear the rect so the top edge tilts at
 * `slant` degrees from horizontal (top-right shifts UP by
 * w*tan(slant) while the left edge stays vertical). */
export function wallRectCorners(r: WallRect): [number, number][] {
  if (r.points && r.points.length >= 3) {
    return r.points.map((p) => [p.x, p.y]);
  }
  const slant = r.slant ?? 0;
  if (slant === 0) {
    return [
      [r.x, r.y],
      [r.x + r.w, r.y],
      [r.x + r.w, r.y + r.h],
      [r.x, r.y + r.h],
    ];
  }
  const shift = r.w * Math.tan((slant * Math.PI) / 180);
  return [
    [r.x, r.y],
    [r.x + r.w, r.y - shift],
    [r.x + r.w, r.y + r.h - shift],
    [r.x, r.y + r.h],
  ];
}

/* String form for SVG <polygon points>. */
export function wallRectPoints(r: WallRect): string {
  return wallRectCorners(r)
    .map(([x, y]) => `${x},${y}`)
    .join(" ");
}

/* Build an SVG path `d` string from a wall rect. If `radius` is
 * 0 (or undefined) the result is a sharp-cornered polygon;
 * otherwise each corner is replaced by a quadratic-bezier curve
 * with the corner itself as the control point. Works for slanted
 * parallelograms too — the rounding length on each edge is
 * clamped to half the edge length so it never overshoots. */
export function wallRectPath(r: WallRect): string {
  const corners = wallRectCorners(r);
  const radius = r.radius ?? 0;
  if (radius <= 0) {
    return `M ${corners.map((c) => c.join(",")).join(" L ")} Z`;
  }
  const n = corners.length;
  const len = (a: [number, number], b: [number, number]) =>
    Math.hypot(a[0] - b[0], a[1] - b[1]);
  const interp = (
    a: [number, number],
    b: [number, number],
    t: number,
  ): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

  // For each corner i compute the arc start (along the edge from
  // i-1) and arc end (along the edge to i+1). The corner itself is
  // the bezier control point.
  const segs = corners.map((cur, i) => {
    const prev = corners[(i - 1 + n) % n];
    const next = corners[(i + 1) % n];
    const r1 = Math.min(radius, len(prev, cur) / 2, len(cur, next) / 2);
    const arcStart = interp(cur, prev, r1 / len(prev, cur));
    const arcEnd = interp(cur, next, r1 / len(cur, next));
    return { cur, arcStart, arcEnd };
  });

  // Start at the end-arc of corner 0, then for each subsequent
  // corner draw a line to its arc-start and a Q-curve through the
  // corner to its arc-end. Close with a final Q.
  let d = `M ${segs[0].arcEnd[0]},${segs[0].arcEnd[1]} `;
  for (let i = 1; i < n; i++) {
    const s = segs[i];
    d += `L ${s.arcStart[0]},${s.arcStart[1]} `;
    d += `Q ${s.cur[0]},${s.cur[1]} ${s.arcEnd[0]},${s.arcEnd[1]} `;
  }
  d += `L ${segs[0].arcStart[0]},${segs[0].arcStart[1]} `;
  d += `Q ${segs[0].cur[0]},${segs[0].cur[1]} ${segs[0].arcEnd[0]},${segs[0].arcEnd[1]} `;
  d += "Z";
  return d;
}

/* Hand-drawn paths from the in-page calibrator (?calibrate=1).
 * Coordinates live in the PNG's 1614×676 viewBox and pass directly
 * through anchors the designer dropped on the visible belt deck —
 * Catmull-Rom Bezier smoothing in between.
 *
 * Flow is LEFT → RIGHT: raw CVs emerge from the J-curve on the
 * leftmost belt and are processed through filter / score stations
 * as they travel right, exiting as final candidates at the booth. */
/* Re-exported below as DEFAULT_BELTS_FOR_CALIBRATOR so the
 * in-page belt path editor can read the existing `d` strings and
 * seed its anchor points from them. The internal name stays
 * `BELTS` for backward compatibility within this file. */
const BELTS: Belt[] = [
  // Belt 1 (5 anchors): J-curve — raw CVs come out of the loading
  // bay and head up into station 1. Higher cardCount keeps the
  // pile density dense on the entry belt.
  {
    id: "messa-belt-1",
    d: "M 442,498 C 431.5,491.8 394.3,475.2 379,461 C 363.7,446.8 348.0,429.5 350,413 C 352.0,396.5 372.5,379.5 391,362 C 409.5,344.5 449.3,317.0 461,308",
    dur: 7,
    cardCount: 5,
    variant: 1,
  },
  // Belt 2 (4 anchors): station 1 → station 2, filtered
  {
    id: "messa-belt-2",
    d: "M 473,329 C 483.3,335.7 516.7,359.2 535,369 C 553.3,378.8 561.3,393.7 583,388 C 604.7,382.3 651.3,343.8 665,335",
    dur: 5,
    cardCount: 3,
    variant: 2,
  },
  // Belt 3 (3 anchors): station 2 → station 3, scored. Denser
  // pile count to match the busy flow on the entry + exit belts.
  {
    id: "messa-belt-3",
    d: "M 813,384 C 830.5,393.8 884.5,442.3 918,443 C 951.5,443.7 998.0,397.2 1014,388",
    dur: 5,
    cardCount: 4,
    variant: 3,
  },
  // Belt 4 (2 anchors): station 3 → exit booth — final candidates.
  // Denser pile count so the output side feels like a steady
  // stream of approved files heading to the exit, balancing the
  // dense intake on belt 1.
  {
    id: "messa-belt-4",
    d: "M 1134,428 L 1278,510",
    dur: 4,
    cardCount: 4,
    variant: 4,
  },
];

/* Palette pulled from /factory tokens. */
const ACCENT = "#4D62AD";
const SAGE = "#7AA582";
const AMBER = "#D9924A";

/* Isometric box (parcel) SVG. Draws three visible faces with light/
 * shadow values so the box reads as 3D against the iso illustration.
 *
 * Geometry (iso 30°):
 *   - W = width along the "right-back" axis
 *   - D = depth along the "left-back" axis
 *   - H = vertical height
 * The 30° projection uses cos(30°) ≈ 0.866 for x, sin(30°) = 0.5 for y.
 *
 * Coordinates are placed so the box's visual centroid sits near (0,0)
 * — <animateMotion> drops the card at the belt path, and the box
 * appears to STAND on it rather than overlap.
 *
 * Variants 1→4 mark progressive transformation by stacking a top-face
 * decoration (tape stripe, sage dot, accent score bar, gold star). */
type PileOptions = {
  sheetCount: number;
  baseOX: number;
  baseOY: number;
  variant: 1 | 2 | 3 | 4;
  /** Skip the shadow + bloom (use when several piles share one shadow). */
  showShadow?: boolean;
  /** Skip the v2+/v3+/v4 marks (use for piles that aren't the "hero" stack). */
  showVariantMarks?: boolean;
  /** Slight pile width override — smaller piles for the messy cluster. */
  widthFactor?: number;
  /** Paper color — cream (default white-ish) or yellow (legal pad). */
  paperColor?: "cream" | "yellow";
  /** Shadow tuning — overrides DEFAULT_CARD_SHADOW per pile. */
  cardShadow?: CardShadow;
};

/* Mini-CV layout rendered ON the iso top face — header banner, photo
 * silhouette, and body text lines. Turns each pile from "generic
 * paper" into "an actual résumé being processed."
 *
 * Document coordinates use (u, v) where u runs along the TL→TB axis
 * (the back-left edge of the diamond) and v runs along the TL→TF
 * axis (the front-left edge). docPoint(u, v) maps a unit-square
 * document into the iso top-face parallelogram. */
function CVTopFace({
  TL,
  TF,
  TB,
  paperColor,
}: {
  TL: [number, number];
  TF: [number, number];
  TB: [number, number];
  paperColor: "cream" | "yellow";
}) {
  const fmt = (p: [number, number]) =>
    `${p[0].toFixed(2)},${p[1].toFixed(2)}`;

  const docPoint = (u: number, v: number): [number, number] => [
    TL[0] + u * (TB[0] - TL[0]) + v * (TF[0] - TL[0]),
    TL[1] + u * (TB[1] - TL[1]) + v * (TF[1] - TL[1]),
  ];

  // Per-paper palette — darker tones on yellow legal-pad piles.
  const isYellow = paperColor === "yellow";
  const headerFill = isYellow
    ? "rgba(95,65,15,0.55)"
    : "rgba(70,60,40,0.55)";
  const photoFill = isYellow
    ? "rgba(85,55,15,0.50)"
    : "rgba(75,60,40,0.48)";
  const primaryFill = isYellow
    ? "rgba(135,95,25,0.34)"
    : "rgba(140,125,95,0.30)";
  const secondaryFill = isYellow
    ? "rgba(120,85,20,0.24)"
    : "rgba(130,115,90,0.22)";

  // Horizontal bar helper — runs along u with perpendicular thickness
  // in v units. All four corners go through docPoint so the bar
  // picks up the iso shear of the top face automatically.
  const bar = (
    uStart: number,
    uEnd: number,
    v: number,
    t: number,
    fill: string,
    key: string,
  ) => {
    const p1 = docPoint(uStart, v - t / 2);
    const p2 = docPoint(uEnd, v - t / 2);
    const p3 = docPoint(uEnd, v + t / 2);
    const p4 = docPoint(uStart, v + t / 2);
    return (
      <polygon
        key={key}
        points={`${fmt(p1)} ${fmt(p2)} ${fmt(p3)} ${fmt(p4)}`}
        fill={fill}
      />
    );
  };

  // Photo silhouette — circle in document space, approximated as a
  // 16-sided polygon then projected through docPoint so it shears
  // correctly with the iso face.
  const photoUC = 0.22;
  const photoVC = 0.32;
  const photoR = 0.105;
  const photoPoints = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return docPoint(
      photoUC + photoR * Math.cos(a),
      photoVC + photoR * Math.sin(a),
    );
  });

  return (
    <>
      {/* Name banner — wide thick bar at top of the document */}
      {bar(0.08, 0.94, 0.13, 0.09, headerFill, "cv-header")}

      {/* Photo silhouette — round headshot in the top-left area */}
      <polygon
        points={photoPoints.map(fmt).join(" ")}
        fill={photoFill}
      />

      {/* Body text — two lines next to the photo, five lines below */}
      {bar(0.40, 0.86, 0.28, 0.030, primaryFill, "cv-l1")}
      {bar(0.40, 0.74, 0.36, 0.030, secondaryFill, "cv-l2")}
      {bar(0.10, 0.86, 0.52, 0.030, primaryFill, "cv-l3")}
      {bar(0.10, 0.68, 0.60, 0.030, secondaryFill, "cv-l4")}
      {bar(0.10, 0.84, 0.70, 0.030, primaryFill, "cv-l5")}
      {bar(0.10, 0.56, 0.78, 0.030, secondaryFill, "cv-l6")}
      {bar(0.10, 0.78, 0.87, 0.030, primaryFill, "cv-l7")}
    </>
  );
}

/* Renders ONE iso pile at the given base offset. Pulled out so the
 * cluster of messy piles on variant 1 can call it multiple times
 * with different sheetCount + position. */
function IsoSinglePile({
  sheetCount,
  baseOX,
  baseOY,
  variant,
  showShadow = true,
  showVariantMarks = true,
  widthFactor = 1,
  paperColor = "cream",
  cardShadow,
}: PileOptions) {
  const cs: Required<CardShadow> = {
    ...DEFAULT_CARD_SHADOW,
    ...(cardShadow ?? {}),
  };
  // Each parcel is a stack of paper sheets.
  const SHEET_H = 1.5;

  // Iso projection at 30°.
  const W = 22 * widthFactor;
  const D = 15 * widthFactor;
  const H = sheetCount * SHEET_H;
  const CX = 0.866;
  const CY = 0.5;
  const OX = baseOX;
  const OY = baseOY;

  // Bottom corners (y = OY is the "ground" the box sits on)
  const BF: [number, number] = [OX, OY];
  const BR: [number, number] = [OX + W * CX, OY - W * CY];
  const BB: [number, number] = [OX + W * CX - D * CX, OY - W * CY - D * CY];
  const BL: [number, number] = [OX - D * CX, OY - D * CY];

  // Top corners — same X, Y shifted up by H
  const TF: [number, number] = [BF[0], BF[1] - H];
  const TR: [number, number] = [BR[0], BR[1] - H];
  const TB: [number, number] = [BB[0], BB[1] - H];
  const TL: [number, number] = [BL[0], BL[1] - H];

  const fmt = (p: [number, number]) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;

  // Faces pull a subtle gradient from <defs> — cream or yellow set
  // depending on paperColor. Gives each face a light-to-shadow
  // falloff that reads as illustrated paper.
  const suffix = paperColor === "yellow" ? "-yellow" : "";
  const TOP_FILL = `url(#messa-iso-top${suffix})`;
  const LEFT_FILL = `url(#messa-iso-left${suffix})`;
  const RIGHT_FILL = `url(#messa-iso-right${suffix})`;
  const STROKE = paperColor === "yellow"
    ? "rgba(90,70,20,0.45)"
    : "rgba(60,55,40,0.4)";
  const STROKE_W = 0.4;

  // Pile shadow — three layered ellipses for a grounded contact
  // feel: (1) warm bloom halo, (2) ambient blurred cast, (3) tight
  // dark contact band. Center of all three is the pile's footprint
  // centroid; cs.xOffset / cs.yOffset shift them in viewBox units
  // (more negative yOffset = tighter under the pile).
  const shadowCx = OX + (W - D) * CX * 0.5 + cs.xOffset;
  const shadowCy = OY + cs.yOffset;

  return (
    <g>
      {showShadow && (
        <>
          {/* Outer warm bloom — very soft halo to set the box into the
           * cream illustration's ambient warmth instead of cutting it
           * out sharply. */}
          <ellipse
            cx={shadowCx}
            cy={shadowCy - 0.5}
            rx={14 * cs.bloomScale * cs.width}
            ry={4 * cs.bloomScale * cs.height}
            fill="url(#messa-iso-bloom)"
            opacity={cs.bloomOpacity}
          />

          {/* Ambient cast shadow — blurred wide ellipse rotated to
           * align with the iso ground plane's right-back axis. */}
          <ellipse
            cx={shadowCx}
            cy={shadowCy}
            rx={19 * cs.scale * cs.width}
            ry={3.1 * cs.scale * cs.height}
            fill={`rgba(45,30,15,${cs.opacity})`}
            transform={`rotate(-30 ${shadowCx} ${shadowCy})`}
            style={{ filter: `blur(${cs.blur}px)` }}
          />

          {/* Tight contact band — small unblurred ellipse right under
           * the pile that anchors it to the belt deck instead of
           * letting it float on the diffuse cast above. Skipped when
           * contactOpacity = 0. */}
          {cs.contactOpacity > 0 && (
            <ellipse
              cx={shadowCx}
              cy={shadowCy + 0.6}
              rx={11 * cs.scale * cs.width}
              ry={1.6 * cs.scale * cs.height}
              fill={`rgba(30,20,8,${cs.contactOpacity})`}
              transform={`rotate(-30 ${shadowCx} ${shadowCy + 0.6})`}
            />
          )}
        </>
      )}

      {/* Right face (darker, away from light) */}
      <polygon
        points={`${fmt(BF)} ${fmt(BR)} ${fmt(TR)} ${fmt(TF)}`}
        fill={RIGHT_FILL}
        stroke={STROKE}
        strokeWidth={STROKE_W}
        strokeLinejoin="round"
      />

      {/* Left face (medium) */}
      <polygon
        points={`${fmt(BL)} ${fmt(BF)} ${fmt(TF)} ${fmt(TL)}`}
        fill={LEFT_FILL}
        stroke={STROKE}
        strokeWidth={STROKE_W}
        strokeLinejoin="round"
      />

      {/* Sheet edges — horizontal lines on the LEFT and RIGHT side
       * faces at every sheet boundary. Make the pile look layered
       * instead of a solid box. (Skipped for the single-sheet
       * variant, which has nothing to layer.) */}
      {sheetCount > 1 &&
        Array.from({ length: sheetCount - 1 }).flatMap((_, i) => {
          const f = (i + 1) / sheetCount;
          const yL_left = BL[1] - f * H;
          const yF_left = BF[1] - f * H;
          const yR_right = BR[1] - f * H;
          return [
            // LEFT face: BL → BF horizontal
            <line
              key={`sheet-L-${i}`}
              x1={BL[0]}
              y1={yL_left}
              x2={BF[0]}
              y2={yF_left}
              stroke="rgba(60,55,40,0.32)"
              strokeWidth={0.3}
            />,
            // RIGHT face: BF → BR horizontal
            <line
              key={`sheet-R-${i}`}
              x1={BF[0]}
              y1={yF_left}
              x2={BR[0]}
              y2={yR_right}
              stroke="rgba(60,55,40,0.32)"
              strokeWidth={0.3}
            />,
          ];
        })}

      {/* Top face (lightest) */}
      <polygon
        points={`${fmt(TL)} ${fmt(TF)} ${fmt(TR)} ${fmt(TB)}`}
        fill={TOP_FILL}
        stroke={STROKE}
        strokeWidth={STROKE_W}
        strokeLinejoin="round"
      />

      {/* Specular-ish highlight along the front-left edge of the top
       * face — TL→TF. Thin bright stroke suggesting the rim where
       * the top edge catches the upper-left light. */}
      <line
        x1={TL[0]}
        y1={TL[1]}
        x2={TF[0]}
        y2={TF[1]}
        stroke="rgba(255,255,255,0.55)"
        strokeWidth={0.6}
        strokeLinecap="round"
      />

      {/* Mini-CV layout — header banner, photo silhouette, body text
       * lines. Replaces the generic ruled stripes so each pile reads
       * as an actual résumé. */}
      <CVTopFace TL={TL} TF={TF} TB={TB} paperColor={paperColor} />

      {/* Variant marks — inspection stamps that accumulate stage by
       * stage. Positioned in the document's right gutter (in iso
       * doc-space) so they sit beside the body text, not on top of
       * it. v2 dot = filtered, v3 bar = scored, v4 check = final
       * candidate (approved). */}
      {showVariantMarks && (() => {
        const dp = (u: number, v: number): [number, number] => [
          TL[0] + u * (TB[0] - TL[0]) + v * (TF[0] - TL[0]),
          TL[1] + u * (TB[1] - TL[1]) + v * (TF[1] - TL[1]),
        ];
        const dot = dp(0.93, 0.30);
        const bar = dp(0.93, 0.42);
        const check = dp(0.93, 0.56);
        return (
          <g>
            {variant >= 2 && <circle cx={dot[0]} cy={dot[1]} r={1.0} fill={SAGE} />}
            {variant >= 3 && (
              <rect
                x={bar[0] - 2.6}
                y={bar[1] - 0.55}
                width={5.2}
                height={1.1}
                rx={0.5}
                fill={ACCENT}
              />
            )}
            {variant >= 4 && (
              /* Tiny sage check — marks the final-candidate pile
               * as approved. Two stroke segments: short rise on
               * the left, long stroke on the right. */
              <g transform={`translate(${check[0]}, ${check[1]})`}>
                <path
                  d="M -1.6 0 L -0.4 1.4 L 1.8 -1.8"
                  fill="none"
                  stroke={SAGE}
                  strokeWidth={0.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            )}
          </g>
        );
      })()}
    </g>
  );
}

/* Per-variant sheet counts. Each variant gets a SET of counts so
 * consecutive cards on the same belt have different pile heights —
 * "one pile per card, each a different stack." Index modulo the
 * array picks the count per card position. */
const SHEETS_BY_VARIANT: Record<1 | 2 | 3 | 4, number[]> = {
  1: [9, 6, 11, 7],  // raw CVs — tall, varied stacks
  2: [6, 4, 7],      // filtered — medium varied
  3: [3, 2, 4],      // scored — small varied
  4: [1, 1, 1],      // final candidate — always a single sheet
};

/* Per-card paper color — most piles are cream (white-ish), some are
 * yellow (legal pad) for visual variety. Mix and match per card
 * index; index modulo the array picks the color. */
const COLORS_BY_VARIANT: Record<1 | 2 | 3 | 4, ("cream" | "yellow")[]> = {
  1: ["cream", "yellow", "cream", "yellow"],
  2: ["cream", "cream", "yellow"],
  3: ["yellow", "cream", "cream"],
  4: ["cream", "cream", "cream"],
};

function IsoBoxSVG({
  variant,
  cardIndex,
  cardShadow,
}: {
  variant: 1 | 2 | 3 | 4;
  cardIndex: number;
  cardShadow?: CardShadow;
}) {
  const counts = SHEETS_BY_VARIANT[variant];
  const colors = COLORS_BY_VARIANT[variant];
  const sheetCount = counts[cardIndex % counts.length];
  const paperColor = colors[cardIndex % colors.length];
  return (
    <IsoSinglePile
      sheetCount={sheetCount}
      baseOX={-2}
      baseOY={9}
      variant={variant}
      paperColor={paperColor}
      cardShadow={cardShadow}
    />
  );
}


/* ── Reduced-motion external store ──
 * Module-level subscribe/snapshot pair for useSyncExternalStore so
 * the OS accessibility setting is read during render rather than via
 * a setState-in-effect (which triggers a cascading second render).
 * The server snapshot is `false` (motion enabled) — identical to the
 * previous useState(false) default — so server-rendered markup and
 * the hydration pass are byte-for-byte unchanged. Toggling the OS
 * setting still takes effect without a refresh via the matchMedia
 * "change" subscription. */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (onStoreChange: () => void) => {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
};
const getReducedMotionSnapshot = () =>
  window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getReducedMotionServerSnapshot = () => false;

/* The conveyor SVG is memoized: HeroFactory re-renders every 2.2s
 * for the cycling "trusted by" name, and every parent re-render
 * causes most browsers to re-evaluate the descendant SMIL animations
 * (animateMotion / animate / animateTransform). That manifests as a
 * visible periodic flash on the cards as their animations restart.
 * React.memo prevents the re-render when the props are identical. */
const ConveyorOverlayImpl = ({
  wallRects = DEFAULT_WALL_RECTS,
  doorShadows = DEFAULT_DOOR_SHADOWS,
  shadowOpacity = DEFAULT_SHADOW_OPACITY,
  shadowDarkness = DEFAULT_SHADOW_DARKNESS,
  shadowLightness = DEFAULT_SHADOW_LIGHTNESS,
  shadowMidpoint = DEFAULT_SHADOW_MIDPOINT,
  shadowBlend = DEFAULT_SHADOW_BLEND,
  shadowColor = DEFAULT_SHADOW_COLOR,
  cardShadow,
  signIcons = DEFAULT_SIGN_ICONS,
  buildingTexts = DEFAULT_BUILDING_TEXTS,
  introSign = DEFAULT_INTRO_SIGN,
  floatingImages = DEFAULT_FLOATING_IMAGES,
  sidewalkShadows = DEFAULT_SIDEWALK_SHADOWS,
  isoRects = DEFAULT_ISO_RECTS,
  wallAngleDeg = DEFAULT_WALL_ANGLE_DEG,
  showStructure = true,
  showBoxes = true,
  maskBoxes = true,
  showGradients = true,
  glowSteady = false,
}: {
  /** Override the wall occluder positions — used by the mask
   * calibrator for live drag-to-tune editing. */
  wallRects?: WallRect[];
  /** Door-shadow polygons (gradient overlays drawn on top of the
   * cards). Positioned independently from wallRects. */
  doorShadows?: DoorShadow[];
  /** Multiplier on the door-shadow group's opacity (0–1). The
   * gradient itself runs lightness→darkness; this dims the whole
   * layer. */
  shadowOpacity?: number;
  /** stop-opacity at the DARK end of each shadow gradient (0–1). */
  shadowDarkness?: number;
  /** stop-opacity at the LIGHT end of each shadow gradient (0–1).
   * Non-zero values make even the "door" edge slightly tinted. */
  shadowLightness?: number;
  /** Position of the intermediate gradient stop (0–1). 0.5 = linear;
   * lower concentrates the transition near the dark end, higher
   * concentrates it near the light end. */
  shadowMidpoint?: number;
  /** CSS mix-blend-mode applied to the shadow group. "multiply"
   * gives a richer warm darkening on the cream illustration;
   * "normal" is straight alpha-over. */
  shadowBlend?: ShadowBlend;
  /** Default color for the shadow gradient stops. Each DoorShadow
   * can override per-instance via its own `color`. */
  shadowColor?: string;
  /** Per-pile shadow tuning override. Merges with DEFAULT_CARD_SHADOW. */
  cardShadow?: CardShadow;
  /** Override the rooftop sign icons. Defaults to DEFAULT_SIGN_ICONS. */
  signIcons?: SignIcon[];
  /** Override the building-wall text labels. Defaults to
   * DEFAULT_BUILDING_TEXTS. */
  buildingTexts?: BuildingText[];
  /** Override the standing intro sign. Defaults to DEFAULT_INTRO_SIGN. */
  introSign?: IntroSign;
  /** Floating image overlays (e.g. the leaderboard panel under
   * Building 3). Defaults to DEFAULT_FLOATING_IMAGES. */
  floatingImages?: FloatingImage[];
  /** Soft gradient parallelograms on the ground (each one
   * independently positioned + angled). Defaults to
   * DEFAULT_SIDEWALK_SHADOWS — pass [] to disable entirely. */
  sidewalkShadows?: SidewalkShadow[];
  /** Flat iso-projected ground tiles (parking pads, zone markers).
   * Renders BEFORE the floating images so trucks stack on top. */
  isoRects?: IsoRect[];
  /** Angle (degrees) of the iso wall plane that the rooftop icons
   * and building-wall texts project onto. Defaults to 30° (true
   * isometric). The TextCalibrator scrubs this to match the
   * illustration's actual diagonals. */
  wallAngleDeg?: number;
  /** Case-study port: gate the standing intro sign (Messa wordmark +
   * ingredient rows) so it can be its own "Signs" layer. */
  showStructure?: boolean;
  /** Case-study port: the CV cards (boxes) riding the conveyor belts. */
  showBoxes?: boolean;
  /** Case-study port: whether the boxes are clipped by the wall-occluder
   * mask (off = cards show through the walls, exposing the masking). */
  maskBoxes?: boolean;
  /** Case-study port: the per-stage radial-gradient glow ellipses. */
  showGradients?: boolean;
  /** Demo-only: freeze the stage-zone glows ON (no pulse) and boost
   * them so the Gradients toggle is obviously visible. The shipped
   * hero leaves this false to keep the subtle staggered pulse. */
  glowSteady?: boolean;
} = {}) => {
  /* Convert the configured projection angle to the matrix
   * coefficients used everywhere below. Computing it once here
   * keeps the math single-source. */
  const wallAngleRad = (wallAngleDeg * Math.PI) / 180;
  const CX = Math.cos(wallAngleRad);
  const CY = Math.sin(wallAngleRad);

  /* PERF — pause SMIL animations based on three independent signals.
   *
   * The main overlay <svg> contains ~9 concurrent animateTransform
   * elements (truck back-up curves, card slides along belts, sign
   * icon strokeDashoffset draws, intro-sign logo draws) plus
   * blurReveal/iconDraw/logoDraw CSS keyframes on its children.
   * Without gating, those tick at 60Hz forever. Three signals stop
   * the ticking; if ANY is active the SVG is paused:
   *
   *   1. REDUCED-MOTION GATE.
   *      Users who've opted out of motion (OS accessibility setting)
   *      get a permanently static scene. We do NOT additionally gate
   *      on viewport width — mobile users still see the animation,
   *      because the conveyor's entry animations rely on movement to
   *      reveal elements that start off-screen / at opacity 0. A
   *      mid-state pause would leave those invisible, which is worse
   *      than the perf cost on most modern mobile GPUs. The IO +
   *      visibility pauses below still help mobile users sustain.
   *
   *      Implementation: when reduced-motion matches we skip
   *      currentTime ahead by 999s so animations with fill="freeze"
   *      land at their END state (truck docked, sign icons fully
   *      drawn, building texts visible) — then pause. Repeating
   *      animations (cards looping along belts) land at whatever
   *      mid-cycle point t=999 produces, which is acceptable: the
   *      user opted out of motion, so a frozen mid-cycle is fine.
   *
   *   2. INTERSECTION OBSERVER — pause when off-screen.
   *      rootMargin "200px 0px" keeps the animation running until
   *      well past the viewport and resumes slightly before it
   *      scrolls back into view, so users never see a paused frame
   *      mid-scroll.
   *
   *   3. PAGE VISIBILITY API — pause when tab/window hidden.
   *      Directly addresses the client's screen-sharing complaint:
   *      when the presenter switches to another tab, Chrome's
   *      tab-capture pipeline keeps re-encoding the original tab
   *      until something stops painting. Pausing the SMIL stops
   *      the encoding cost too.
   *
   * SVGSVGElement exposes native pauseAnimations() / unpauseAnimations()
   * for SMIL — cheaper than display:none (no layout thrash) and
   * reversible without flashing.
   *
   * BOTH SVGs need gating now that the shadow <svg> has indefinitely-
   * looping animateTransforms (truck-shadow round-trip cycle). If we
   * only paused the main overlay, the truck's SMIL clock would fall
   * behind the shadow's during pause/visibility events — and they'd
   * stay drifted forever after the next unpause, so the truck would
   * be e.g. driving out while the shadow is driving in. Both refs
   * track lockstep play/pause and lockstep setCurrentTime resets. */
  const mainSvgRef = useRef<SVGSVGElement | null>(null);
  const backdropSvgRef = useRef<SVGSVGElement | null>(null);
  /* Reduced-motion gate — subscribed via useSyncExternalStore (see
   * the module-level store above ConveyorOverlayImpl) so toggling the
   * OS accessibility setting takes effect without a refresh. */
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const [perfMode] = usePerfMode();
  /* Unified "freeze the conveyor permanently" signal — combines the
   * OS-level reduced-motion preference with the user-toggleable
   * perf-mode flag (Shift+P / ?perf=on / floating indicator). Either
   * one routes through the same end-state-freeze code path below. */
  const freezePermanent = reducedMotion || perfMode;

  /* Freeze handler — when either signal flips on, skip to end of all
   * animations then pause indefinitely. When both signals flip off
   * again (e.g. user disables perf-mode), reset to t=0 and unpause
   * so the SVG re-plays normally. Without the reset, unpauseAnimations
   * would resume at currentTime=999 — past the end of every animation,
   * so they'd stay visually frozen at end state instead of looping. */
  useEffect(() => {
    const main = mainSvgRef.current;
    const backdrop = backdropSvgRef.current;
    if (!main && !backdrop) return;
    if (freezePermanent) {
      /* setCurrentTime jumps the SMIL clock forward. 999s comfortably
       * past every animation's natural end (longest is the belt cycle
       * at ~21s + the exit truck entrance at ~24s total). Animations
       * with fill="freeze" remain at their end values; non-freeze
       * animations revert to base, which here means cards reset to
       * belt start positions — acceptable for a paused snapshot. */
      main?.setCurrentTime(999);
      main?.pauseAnimations();
      backdrop?.setCurrentTime(999);
      backdrop?.pauseAnimations();
    } else {
      /* Reset BOTH clocks to 0 in lockstep, then unpause both. The IO
       * + visibility effects below also drive both refs together so
       * the SMIL clocks never drift relative to each other. */
      main?.setCurrentTime(0);
      main?.unpauseAnimations();
      backdrop?.setCurrentTime(0);
      backdrop?.unpauseAnimations();
    }
  }, [freezePermanent]);

  /* Intersection observer — runs only when motion is allowed. When
   * freezePermanent is true we skip setup entirely; the effect above
   * has already paused both SVGs. We observe the MAIN overlay (it's
   * positioned over the same hero rect as the backdrop) and drive
   * both refs together so their clocks stay synced. */
  useEffect(() => {
    const main = mainSvgRef.current;
    if (!main || freezePermanent) return;
    if (typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const backdrop = backdropSvgRef.current;
        if (entry.isIntersecting) {
          main.unpauseAnimations();
          backdrop?.unpauseAnimations();
        } else {
          main.pauseAnimations();
          backdrop?.pauseAnimations();
        }
      },
      { rootMargin: "200px 0px", threshold: 0 },
    );
    obs.observe(main);
    return () => obs.disconnect();
  }, [freezePermanent]);

  /* Visibility-change pause — same gating: skip when motion disabled.
   * Both SVGs pause/resume together so their SMIL clocks stay in
   * lockstep across tab visibility flips. */
  useEffect(() => {
    if (freezePermanent) return;
    const onVisibility = () => {
      const main = mainSvgRef.current;
      const backdrop = backdropSvgRef.current;
      if (document.hidden) {
        main?.pauseAnimations();
        backdrop?.pauseAnimations();
      } else {
        main?.unpauseAnimations();
        backdrop?.unpauseAnimations();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [freezePermanent]);

  return (
    <>
    {/* SHADOW LAYER — separate <svg> sat BEHIND the factory PNG
     * via z-index: -1. The PNG itself is opaque over the buildings
     * and sidewalk, so it occludes the inner portions of each
     * shadow polygon — only the portions extending past a building/
     * truck/object onto the ground remain visible against the
     * section's cream gradient. The .factory-hero-illustration
     * parent uses `isolation: isolate` to keep the negative z-index
     * contained within that local stacking context (otherwise the
     * shadow would escape upward past sibling sections).
     *
     * PERF — `mix-blend-mode: multiply` was previously set on this
     * layer to integrate the shadows warmly into the cream backdrop.
     * Removed: the shadow polygons fill with #2A1F12 at ~0.14 opacity
     * on cream, and at those values normal alpha-blend produces a
     * nearly-identical result to multiply (verified per-channel:
     * cream × 0.87 vs cream × 0.86 + dark × 0.14 — sub-1% delta).
     * Dropping the blend mode removes a top-level stacking context
     * and lets Chrome promote this SVG to its own GPU layer cleanly
     * — a significant compositor win without a visible cost. */}
    <svg
      ref={backdropSvgRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      viewBox="0 0 1614 676"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      style={{
        zIndex: -1,
        overflow: "visible",
      }}
    >
      <defs>
        {isoRects.map((r, i) =>
          (r.blur ?? 0) > 0 ? (
            <filter
              key={`iso-rect-blur-bg-${i}`}
              id={`messa-iso-rect-blur-${i}`}
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
              filterUnits="objectBoundingBox"
            >
              <feGaussianBlur stdDeviation={r.blur} />
            </filter>
          ) : null,
        )}
      </defs>
      <g aria-hidden>
        {isoRects.map((r, i) => {
          /* Custom vector points override the auto-computed iso
           * rhombus. Used when the user has switched a shadow into
           * "vector mode" via the calibrator and dragged individual
           * vertices to reshape it. Otherwise, the rhombus is
           * computed from widthX/depthY/angleDeg as before. */
          let points: string;
          if (r.points && r.points.length >= 3) {
            points = r.points.map((p) => `${p[0]},${p[1]}`).join(" ");
          } else {
            const rectRad = ((r.angleDeg ?? wallAngleDeg) * Math.PI) / 180;
            const rCX = Math.cos(rectRad);
            const rCY = Math.sin(rectRad);
            const halfW = r.widthX / 2;
            const halfD = r.depthY / 2;
            const top    = [r.x - rCX * (halfW - halfD), r.y - rCY * (halfW + halfD)];
            const right  = [r.x + rCX * (halfW + halfD), r.y + rCY * (halfW - halfD)];
            const bottom = [r.x + rCX * (halfW - halfD), r.y + rCY * (halfW + halfD)];
            const left   = [r.x - rCX * (halfW + halfD), r.y - rCY * (halfW - halfD)];
            points = `${top[0]},${top[1]} ${right[0]},${right[1]} ${bottom[0]},${bottom[1]} ${left[0]},${left[1]}`;
          }
          const hasBlur = (r.blur ?? 0) > 0;
          const hasEnter =
            typeof r.enterFromX === "number" ||
            typeof r.enterFromY === "number";
          const enterX = r.enterFromX ?? 0;
          const enterY = r.enterFromY ?? 0;
          const enterDur = r.enterDuration ?? 3.5;
          const enterDelay = r.enterDelay ?? 0;
          /* Round-trip cycle config — mirrors the FloatingImage
           * pattern so a truck and its shadow tick on identical
           * SMIL clocks. When roundTrip is true, the rect drives
           * in, dwells docked, drives back out, waits offscreen,
           * and loops forever. */
          const roundTrip = !!(r.roundTrip && hasEnter);
          const dwellDur = r.dwellDuration ?? 5;
          const offDur = r.offDuration ?? 3;
          const cycleDur = enterDur + dwellDur + enterDur + offDur;
          const rtT1 = enterDur / cycleDur;
          const rtT2 = (enterDur + dwellDur) / cycleDur;
          const rtT3 = (enterDur + dwellDur + enterDur) / cycleDur;
          /* Opacity-fade chain: hold the polygon at fillOpacity=0
           * during the enterDelay (so a shadow with a long pre-roll
           * doesn't sit visibly at its offset start position), then
           * ramp to its configured opacity over the first 55% of
           * the entrance animation. Mirrors the chained fade used
           * on FloatingImage. Only emitted when enterFade is true
           * and there's actually an entrance to delay against. */
          const enterFade = !!(r.enterFade && hasEnter);
          const totalFadeDur = enterDelay + enterDur;
          const tHoldEnd = enterDelay / totalFadeDur;
          const tFadeEnd =
            (enterDelay + enterDur * 0.55) / totalFadeDur;
          /* Independent of enterFade — used for rects that should
           * simply appear at their docked position with no slide
           * (e.g. the exit truck shadow matching the truck's fade-
           * in arrival). When set, the polygon holds fill-opacity=0
           * until revealDelay, then fades to its configured opacity
           * over 0.8s. */
          const hasReveal = typeof r.revealDelay === "number";
          return (
            <polygon
              key={`iso-rect-bg-${i}`}
              points={points}
              fill={r.color}
              fillOpacity={enterFade || hasReveal ? 0 : r.opacity}
              stroke={r.borderColor ?? "none"}
              strokeWidth={r.borderWidth ?? 0}
              strokeLinejoin="round"
              filter={hasBlur ? `url(#messa-iso-rect-blur-${i})` : undefined}
              /* Static base transform holding the polygon at its
               * enterFrom offset before the SMIL animation begins —
               * without this, the shadow renders at its FINAL docked
               * position during the pre-roll window (t < enterDelay),
               * visibly hugging the dock from page load even though
               * the truck above it hasn't arrived yet. The animation
               * uses additive="sum" with NEGATED values so the
               * effective position starts at (enterX, enterY) — the
               * offset — and freezes at (0, 0) when the SMIL ends. */
              transform={
                hasEnter ? `translate(${enterX} ${enterY})` : undefined
              }
            >
              {hasEnter && !roundTrip && (
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  /* Same negated-values pattern as the FloatingImage
                   * entrance — start at (0, 0), end at (-eX, -eY),
                   * combined with the polygon's static translate
                   * (eX, eY) the effective position lands at (0, 0)
                   * at animation end. */
                  values={`0 0; ${-enterX} ${-enterY}`}
                  keyTimes="0; 1"
                  dur={`${enterDur}s`}
                  begin={`${enterDelay}s`}
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.22 1 0.36 1"
                  additive="sum"
                />
              )}
              {hasEnter && roundTrip && (
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  /* Round-trip mirror of the FloatingImage cycle. Five
                   * stops, identical keyTimes / cycleDur as the truck
                   * above so the shadow stays glued to it. Arrival
                   * spline (0.16 1 0.3 1 — ease-out-quint) and
                   * departure spline (0.64 0 0.78 0 — ease-in) MUST
                   * match the truck's exactly — any drift here =
                   * visible separation between truck and shadow during
                   * motion. */
                  values={`0 0; ${-enterX} ${-enterY}; ${-enterX} ${-enterY}; 0 0; 0 0`}
                  keyTimes={`0; ${rtT1.toFixed(4)}; ${rtT2.toFixed(4)}; ${rtT3.toFixed(4)}; 1`}
                  dur={`${cycleDur}s`}
                  begin={`${enterDelay}s`}
                  repeatCount="indefinite"
                  calcMode="spline"
                  keySplines="0.16 1 0.3 1; 0.42 0 0.58 1; 0.64 0 0.78 0; 0.42 0 0.58 1"
                  additive="sum"
                />
              )}
              {enterFade && (
                <animate
                  attributeName="fill-opacity"
                  values={`0; 0; ${r.opacity}; ${r.opacity}`}
                  keyTimes={`0; ${tHoldEnd}; ${tFadeEnd}; 1`}
                  dur={`${totalFadeDur}s`}
                  begin="0s"
                  fill="freeze"
                />
              )}
              {hasReveal && (
                <animate
                  attributeName="fill-opacity"
                  values={`0; ${r.opacity}`}
                  keyTimes="0; 1"
                  dur="0.8s"
                  begin={`${r.revealDelay}s`}
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.22 1 0.36 1"
                />
              )}
            </polygon>
          );
        })}
      </g>
    </svg>

    {/* MAIN OVERLAY — everything else (cards, door shadows, sign
     * icons, building texts, floating images, intro sign). Default
     * z-index (auto) so it stacks above the PNG.
     *
     * The ref + IntersectionObserver + visibilitychange listener above
     * pauseAnimations() on this <svg> when it scrolls off-screen or
     * the tab is hidden — see the PERF block at the top of the
     * component for the rationale. */}
    <svg
      ref={mainSvgRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      viewBox="0 0 1614 676"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      /* shape-rendering: deterministic edge anti-aliasing across
       *   frames, prevents sub-pixel edge shimmer on slanted
       *   parallelograms during the parent's CSS scale animation.
       * overflow: visible: lets the truck PNG (and any other
       *   illustration that sits past viewBox y=676) extend below
       *   the SVG's logical viewport. The wrap up in hero-factory
       *   handles horizontal clipping; we want vertical content
       *   like the truck wheels visible on the page background.
       *
       * REMOVED — transform: translateZ(0) + willChange: transform.
       * Previously here to promote the SVG to its own GPU compositor
       * layer for cheaper re-rasterization during the parent's
       * breathing scale anim. BUT translateZ(0) creates a compositing
       * layer whose bounds clip painted children. The truck
       * FloatingImage entries render past viewBox y=676 via the
       * SVG's overflow:visible, and the layer was cutting them off
       * even though overflow:visible was respected within the SVG's
       * own paint context — the layer's compositing surface is what
       * does the final clipping.
       *
       * Removing these means re-rasterization on each parent scale
       * tick — acceptable given the SMIL pause-on-offscreen gates
       * we shipped. */
      shapeRendering="geometricPrecision"
      style={{
        overflow: "visible",
      }}
    >
      <defs>
        {BELTS.map((b) => (
          <path key={b.id} id={b.id} d={b.d} fill="none" />
        ))}

        {/* Sidewalk shadow gradients — one per shadow, each with
         * its own userSpaceOnUse gradient so direction (driven by
         * gradientAngleDeg) and anchor stay independent. Polygon
         * fill references its gradient by indexed id below. */}
        {sidewalkShadows.map((sh, i) => {
          const gAngle = ((sh.gradientAngleDeg ?? 0) * Math.PI) / 180;
          /* 0° = down (0, 1); positive rotates CW so 90° = right (1, 0). */
          const dx = Math.sin(gAngle);
          const dy = Math.cos(gAngle);
          return (
            <linearGradient
              key={`sw-grad-${i}`}
              id={`messa-sidewalk-shadow-grad-${i}`}
              gradientUnits="userSpaceOnUse"
              x1={sh.x}
              y1={sh.y}
              x2={sh.x + dx * sh.height}
              y2={sh.y + dy * sh.height}
            >
              <stop offset="0%" stopColor={sh.color} stopOpacity={sh.opacity} />
              <stop offset="100%" stopColor={sh.color} stopOpacity="0" />
            </linearGradient>
          );
        })}

        {/* Letterpress sign-icon filter — mirrors the text-shadow
         * recipe used on the `data-tactile="light"` Request-Demo
         * button (globals.css line ~332):
         *
         *   text-shadow:
         *     0 -1px 0 rgba(60,45,25,0.22),   ← warm-dark above
         *     0  1px 0 rgba(255,253,245,0.85); ← cream highlight below
         *
         * That two-line offset (no blur) makes the letters read as
         * pressed INTO the cream surface. For the rooftop sign
         * icons we want the same carved-into-the-sign feel, so:
         *   1. Take SourceAlpha, offset it UP a fraction of a unit,
         *      fill with a warm dark — that's the recessed top edge.
         *   2. Take SourceAlpha, offset it DOWN, fill with warm
         *      cream highlight — that's the light catch at the
         *      bottom of the recess.
         *   3. Merge: light catch on bottom, dark catch on top,
         *      colored stroke on top of both.
         *
         * Magnitude tuned to roughly 1/2 of the visible stroke width
         * at our 43-unit display size — same proportional offset the
         * 1px text-shadow has against the button's ~16px type. */}
        <filter
          id="messa-sign-emboss"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          filterUnits="userSpaceOnUse"
        >
          {/* Recessed top edge — warm dark, offset upward */}
          <feOffset in="SourceAlpha" dx="0" dy="-0.6" result="topOffset" />
          <feFlood floodColor="#3C2D19" floodOpacity="0.32" result="topColor" />
          <feComposite in="topColor" in2="topOffset" operator="in" result="topShadow" />

          {/* Light catch at bottom — warm cream highlight, offset downward */}
          <feOffset in="SourceAlpha" dx="0" dy="0.6" result="bottomOffset" />
          <feFlood floodColor="#FFFDF5" floodOpacity="0.85" result="bottomColor" />
          <feComposite in="bottomColor" in2="bottomOffset" operator="in" result="bottomShadow" />

          <feMerge>
            <feMergeNode in="bottomShadow" />
            <feMergeNode in="topShadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Per-face gradients — give each face a subtle light-to-shadow
         * transition so the boxes feel like illustrated cardboard
         * instead of flat-color rhombuses. Object-bounding-box
         * gradients so they re-stretch across each polygon's bbox.
         *
         * Two color sets: cream (the default white-ish paper) and
         * yellow (legal-pad style). The per-card paperColor prop
         * picks between them. */}
        <linearGradient id="messa-iso-top" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#FCFAF5" />
          <stop offset="100%" stopColor="#EFEAE0" />
        </linearGradient>
        <linearGradient id="messa-iso-left" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E5DFD0" />
          <stop offset="100%" stopColor="#CABFAA" />
        </linearGradient>
        <linearGradient id="messa-iso-right" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C2BAA8" />
          <stop offset="100%" stopColor="#A39A88" />
        </linearGradient>

        {/* Yellow legal-pad variant — slightly more saturated tones
         * so a yellow pile reads as a distinct paper color, not just
         * a warmer cream. */}
        <linearGradient id="messa-iso-top-yellow" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#FBE8A8" />
          <stop offset="100%" stopColor="#F2D58B" />
        </linearGradient>
        <linearGradient id="messa-iso-left-yellow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8CD7A" />
          <stop offset="100%" stopColor="#CCAE5A" />
        </linearGradient>
        <linearGradient id="messa-iso-right-yellow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C5A957" />
          <stop offset="100%" stopColor="#9F873B" />
        </linearGradient>

        {/* Faint warm bloom under each box — anchor the parcel into
         * the warm cream of the illustration. Radial gradient stops
         * are tuned for low-key ambient occlusion. */}
        <radialGradient id="messa-iso-bloom" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(60,42,22,0.18)" />
          <stop offset="60%" stopColor="rgba(60,42,22,0.06)" />
          <stop offset="100%" stopColor="rgba(60,42,22,0)" />
        </radialGradient>

        {/* Wall occluders — black rectangles centered on each belt
         * endpoint. The cards group below is rendered through this
         * mask: white = visible, black = clipped. As a card travels
         * toward an endpoint it enters the black rect and gets
         * progressively clipped, so it reads as "disappearing
         * behind the building wall" instead of fading out. Boxes
         * are slightly wider/taller than the pile silhouette (~40px
         * wide pile + a 20px hide margin) and skewed to roughly
         * match the iso wall orientation at each endpoint. */}
        {/* Door-shadow gradients — visible black-with-opacity stops
         * drawn ON TOP of the cards (not part of the mask). Each
         * polygon runs from solid black at the door edge to
         * transparent black further into the open conveyor, so a
         * card visibly darkens as it approaches a door BEFORE it
         * hits the wall mask behind. Same direction convention as
         * `fade`: name points toward the building interior, which
         * is also the dark end of the shadow inside the door. */}
        {/* One gradient per door shadow. Each shadow can override
         * gradient stops (`darkness` / `lightness`) and color
         * individually; absent values fall back to the global
         * defaults. Endpoints come from shadowGradientUserSpace
         * (userSpaceOnUse) so the gradient ACTUALLY reaches its
         * stop opacities at the polygon's corners — bbox-aligned
         * gradients fall short on slanted parallelograms because
         * the polygon doesn't fill its bbox. */}
        {(() => {
          const midPct = `${(shadowMidpoint * 100).toFixed(1)}%`;
          return doorShadows.map((s, i) => {
            const c = shadowGradientUserSpace(s);
            const dk = s.darkness ?? shadowDarkness;
            const lt = s.lightness ?? shadowLightness;
            const mid = (dk + lt) / 2;
            const col = s.color ?? shadowColor;
            return (
              <linearGradient
                key={`shadow-grad-${i}`}
                id={`messa-shadow-grad-${i}`}
                gradientUnits="userSpaceOnUse"
                x1={c.x1}
                y1={c.y1}
                x2={c.x2}
                y2={c.y2}
              >
                <stop offset="0%" stopColor={col} stopOpacity={lt} />
                <stop offset={midPct} stopColor={col} stopOpacity={mid} />
                <stop offset="100%" stopColor={col} stopOpacity={dk} />
              </linearGradient>
            );
          });
        })()}

        <mask id="messa-belt-mask" maskUnits="userSpaceOnUse">
          {/* Default: everything visible */}
          <rect x="0" y="0" width="1614" height="676" fill="white" />
          {/* One solid-black occluder per belt endpoint. Hard clip:
           * card disappears as it crosses into the wall. The soft
           * "going into shadow" transition is now driven by the
           * separate doorShadows layer rendered below. Path-based
           * so wallRect.radius can round the corners. */}
          {wallRects.map((r, i) => (
            <path
              key={`wall-${i}`}
              d={wallRectPath(r)}
              fill="black"
            />
          ))}
        </mask>

        {/* Radial-gradient for the "active stage" zone highlight.
         *
         * Color: warm amber (#E8C77E). Two reasons not green:
         *   1. The rooftop icon pulse is already green (sage
         *      saturate boost). A separate green wash on the whole
         *      zone competed with the icon and read as "shocking."
         *   2. Amber/gold is the universal "illumination" colour —
         *      sunlight, lamp light, "this thing just lit up." It
         *      tints the cream illustration warmly without changing
         *      its hue family.
         *
         * Stops chosen so the glow is centered + falls off cleanly
         * by the ellipse edge. Low opacity (0.32 at centre, vs the
         * previous green's 0.55) keeps it subtle. */}
        <radialGradient id="messa-stage-zone-glow">
          <stop offset="0%" stopColor="#E8C77E" stopOpacity="0.32" />
          <stop offset="55%" stopColor="#E8C77E" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#E8C77E" stopOpacity="0" />
        </radialGradient>
      </defs>


      {/* CLIENT FEEDBACK — "en las etapas tipo interview/decide, que se
       * iluminen las zonas correspondientes del hero." Three radial
       * glows positioned over each stage's building footprint. They
       * pulse on the same 5s belt cycle as the rooftop icon pulse,
       * with matching staggered delays (1.5s, 2.5s, 3.5s) — so the
       * icon AND the surrounding building zone light up together,
       * reading as "this stage is processing a card right now."
       *
       * Rendered BEFORE the conveyor cards mask group so the glow
       * sits underneath the cards (cards stay crisp on top of the
       * brightened building). mix-blend-mode:multiply is intentional:
       * the amber tint multiplies into the building's painted pixels
       * instead of just stacking on top, which preserves the
       * illustration's structure (windows, signage, etc.) while
       * subtly tinting the whole area sage. */}
      {showGradients && (
      <g
        aria-hidden
        /* mix-blend-mode: multiply tints the cream illustration
         * underneath rather than just stacking amber pixels on top.
         * With the warm amber (#E8C77E), multiply produces a
         * honey-toned glow over the building — reads as "this area
         * is glowing" because the surrounding cream stays normal
         * while the lit zone warms slightly toward amber. Subtler
         * and more illustration-friendly than alpha-stacking.
         *
         * glowSteady (demo only): a saturate/brightness filter deepens
         * the multiply so the constant zones read clearly when the
         * Gradients toggle is flipped. The shipped hero's branch is
         * byte-identical to before (no filter). */
        style={
          glowSteady
            ? { mixBlendMode: "multiply", filter: "saturate(1.5) brightness(0.96)" }
            : { mixBlendMode: "multiply" }
        }
      >
        {[
          { cx: 440, cy: 280, rx: 180, ry: 200, delay: 1.5, label: "Prepare zone" },
          { cx: 765, cy: 330, rx: 200, ry: 220, delay: 2.5, label: "Interview zone" },
          { cx: 1100, cy: 340, rx: 200, ry: 220, delay: 3.5, label: "Decide zone" },
        ].map((z) => (
          <ellipse
            key={z.label}
            cx={z.cx}
            cy={z.cy}
            rx={z.rx}
            ry={z.ry}
            fill="url(#messa-stage-zone-glow)"
            /* "both" fill-mode = the 0% keyframe (opacity:0) applies
             * before the animation starts, and the 100% keyframe
             * (opacity:0) applies after the animation ends. Critical
             * for two cases:
             *   1. Pre-animation: prevents a flash of opacity:1 on
             *      the first paint before the keyframe kicks in.
             *   2. Perf-mode active: globals.css forces
             *      animation-iteration-count:1 + duration:0.01ms,
             *      collapsing the animation to a single instant.
             *      With fill-mode:both, the final 100% (opacity:0)
             *      sticks, so zones stay invisible in perf-mode
             *      instead of stuck at default opacity:1. */
            style={
              glowSteady
                ? { animation: "none", opacity: 1 }
                : {
                    animation: `stageZonePulse 5s ease-in-out ${z.delay}s infinite both`,
                  }
            }
          />
        ))}
      </g>
      )}

      {/* When Masks is toggled OFF (demo only), reveal the now-disabled
       * wall-occluder regions as faint dashed outlines, so the user can
       * SEE the six mask shapes switch off — and watch cards spill over
       * them instead of tucking behind the walls. Gated on
       * `showBoxes && !maskBoxes`, so it renders ONLY in the toggled-off
       * state; the default all-ON hero is byte-identical to before. */}
      {showBoxes && !maskBoxes && (
        <g aria-hidden pointerEvents="none">
          {wallRects.map((r, i) => (
            <path
              key={`wall-off-${i}`}
              d={wallRectPath(r)}
              fill="none"
              stroke={ACCENT}
              strokeWidth={1.5}
              strokeDasharray="5 4"
              strokeOpacity={0.55}
            />
          ))}
        </g>
      )}

      {/* All cards live inside a masked group so the wall occluders
       * in <defs> clip them as they reach the belt endpoints. The
       * card itself stays at full opacity; the mask handles the
       * "enters/exits through the wall" effect for visual continuity. */}
      {showBoxes && (
      <g mask={maskBoxes ? "url(#messa-belt-mask)" : undefined}>
        {BELTS.flatMap((b, beltIdx) =>
          Array.from({ length: b.cardCount }).flatMap((_, i) => {
            // Cascade the belt START times so the conveyor visually
            // populates left → right on first load. Belt N's first
            // card emerges exactly when belt N-1's first card
            // reaches its end (sum of all preceding belts' durs).
            // After ~20s the system reaches steady state and every
            // belt has its full complement of looping cards.
            const beltStartTime = BELTS
              .slice(0, beltIdx)
              .reduce((sum, prev) => sum + prev.dur, 0);
            const offset = beltStartTime + (b.dur / b.cardCount) * i;
            // Per-belt opacity behavior:
            // - Belt 1 (first): fade IN at cycle start (cards appear
            //   at the J-curve floor, which is unmasked). No fade out.
            // - Belt 4 (last): snap in, fade OUT at end (cards exit
            //   the factory through an unmasked right side).
            // - Belts 2-3 (middle): snap in + snap out. Wall masks
            //   handle the appearance/disappearance with hard clips.
            const isFirstBelt = beltIdx === 0;
            const isLastBelt = beltIdx === BELTS.length - 1;
            const fadeValues = isFirstBelt
              ? "0;1;1"
              : isLastBelt
                ? "0;1;1;0"
                : "0;1;1";
            const fadeKeyTimes = isFirstBelt
              ? "0;0.02;1"
              : isLastBelt
                ? "0;0.001;0.98;1"
                : "0;0.001;1";
            // Per-box wobble period varies (2.0s + ±0.4s drift per card)
            // so the 10 boxes in flight don't sway in lockstep.
            const wobbleDur = 2.0 + ((beltIdx * 0.17 + i * 0.31) % 0.8);
            const wobbleBegin = (i * 0.5) % 1.4;
            return (
              <g key={`${b.id}-${i}`} opacity="0">
                {/* Inner wrapper for the wobble rotation — separated
                 * from animateMotion so the rotation doesn't replace
                 * the path-following transform. */}
                <g>
                  <IsoBoxSVG
                    variant={b.variant}
                    cardIndex={i}
                    cardShadow={cardShadow}
                  />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="-1.5;0;1.5;0;-1.5"
                    keyTimes="0;0.25;0.5;0.75;1"
                    dur={`${wobbleDur.toFixed(2)}s`}
                    begin={`-${wobbleBegin.toFixed(2)}s`}
                    repeatCount="indefinite"
                  />
                </g>
                <animateMotion
                  dur={`${b.dur}s`}
                  begin={`${offset}s`}
                  repeatCount="indefinite"
                >
                  <mpath href={`#${b.id}`} />
                </animateMotion>
                {/* Per-belt opacity. Computed above — first belt
                 * fades IN, last belt fades OUT, middle belts snap
                 * in/out so the wall masks do all the work. */}
                <animate
                  attributeName="opacity"
                  values={fadeValues}
                  keyTimes={fadeKeyTimes}
                  dur={`${b.dur}s`}
                  begin={`${offset}s`}
                  repeatCount="indefinite"
                />
              </g>
            );
          })
        )}
      </g>
      )}

      {/* Door shadows — independent gradient polygons drawn ON TOP
       * of the cards (no mask). Each entry positions its own shadow
       * (separate from any wall rect) and supplies a `fade`
       * direction that picks which gradient stop to use. Group
       * opacity is driven by shadowOpacity so the calibrator can
       * dim the whole layer live. */}
      <g
        aria-hidden
        opacity={shadowOpacity}
        /* Only set mixBlendMode when it's not "normal" — some
         * browsers promote the element to a new compositing layer
         * the moment any non-empty mixBlendMode is present, even
         * if it's a no-op. */
        style={
          shadowBlend !== "normal"
            ? { mixBlendMode: shadowBlend }
            : undefined
        }
      >
        {doorShadows.map((s, i) =>
          // Use <polygon> for sharp-cornered shadows and only fall
          // back to <path> when radius > 0. Polygons rasterize with
          // more stable anti-aliasing on slanted edges across
          // parent-scale frames; the path branch is only needed
          // for rounded corners.
          (s.radius ?? 0) > 0 ? (
            <path
              key={`door-shadow-${i}`}
              d={wallRectPath(s)}
              fill={`url(#messa-shadow-grad-${i})`}
            />
          ) : (
            <polygon
              key={`door-shadow-${i}`}
              points={wallRectPoints(s)}
              fill={`url(#messa-shadow-grad-${i})`}
            />
          ),
        )}
      </g>

      {/* Sidewalk drop shadow — a soft gradient parallelogram hugging
       * the bottom edge of the painted sidewalk. Gives the
       * illustration a slight lift off the page so the cream
       * doesn't read as the same shade as the section background.
       * Drawn AFTER the door shadows so it sits above any
       * accidental dark interior spill, but BEFORE the rooftop
       * icons + building texts so the typography stays crisp on top. */}
      {/* Sidewalk shadow polygons — one per entry in
       * sidewalkShadows. Each references its own indexed gradient
       * def from <defs> above. shapeAngleDeg overrides slope when
       * set (slope = tan(angleDeg)). */}
      {sidewalkShadows.map((sh, i) => {
        const W = sh.width;
        const H = sh.height;
        const effSlope =
          typeof sh.shapeAngleDeg === "number"
            ? Math.tan((sh.shapeAngleDeg * Math.PI) / 180)
            : sh.slope;
        const slopeY = W * effSlope;
        const points = [
          `${sh.x},${sh.y}`,
          `${sh.x + W},${sh.y + slopeY}`,
          `${sh.x + W},${sh.y + slopeY + H}`,
          `${sh.x},${sh.y + H}`,
        ].join(" ");
        return (
          <polygon
            key={`sw-poly-${i}`}
            aria-hidden
            points={points}
            fill={`url(#messa-sidewalk-shadow-grad-${i})`}
          />
        );
      })}

      {/* Sign icons are rendered as standalone <img> elements in
       * the React fragment below (outside this SVG) to avoid iOS
       * WebKit bugs where stroked SVG paths inside matrix-
       * transformed groups silently fail to render. See the
       * sign-icon <img> block at the bottom of the fragment. */}

      {/* Building-wall text — stage titles + short subtitles painted
       * on the front face of each building. Uses the same iso wall
       * matrix as the rooftop sign icons, so the type slopes down-
       * right with the architecture and reads as if it's part of
       * the painted facade.
       *
       * Each title sits at the local origin (0, 0); subtitle wraps
       * via \n-separated <tspan>s sitting below. The text rendering
       * uses geometricPrecision so the slanted glyphs stay crisp
       * across browser zoom. */}
      <g aria-hidden>
        {buildingTexts.map((t, i) => {
          const titleSize = t.size ?? 18;
          /* Subtitle uses an explicit subtitleSize when set, else
           * derives from the title at 65%. Decoupling lets the
           * title scale up for presence while the subtitle stays
           * at a comfortable reading size. */
          const subtitleSize = Math.max(10, t.subtitleSize ?? titleSize * 0.65);
          /* Title supports multi-line via \n. We split here so both
           * the render and the subtitle-offset math agree on the
           * number of lines. */
          const titleLines = t.title.split("\n");
          const titleLineCount = titleLines.length;
          const titleColor = t.color ?? "#5A6B8F";
          /* Cream-landing text-secondary equivalent — a warm dusty
           * brown that reads as descriptive copy on the cream wall
           * without competing with the colored title. */
          const subtitleColor = "#7A6E5C";
          const subtitleLines = t.subtitle.split("\n");
          /* Map BuildingText.align to the SVG text-anchor value.
           *   left   → "start"   (text grows right of x)
           *   center → "middle"  (text centered on x)
           *   right  → "end"     (text grows left of x)
           * The anchor still moves with (x, y) — alignment just
           * picks which point of the rendered text glyph row that
           * (x, y) corresponds to. */
          const textAnchor =
            t.align === "center" ? "middle" : t.align === "right" ? "end" : "start";
          /* Pick the title typeface + kerning. Serif uses the font's
           * natural metrics (0em) — matches how display headlines
           * elsewhere on the site read at their scale and lets the
           * letters breathe instead of crowding. Sans stays at
           * +0.04em (default uppercase tracking). */
          const useSerif = t.font === "serif";
          const titleFontFamily = useSerif
            ? "var(--font-serif, Georgia, serif)"
            : "var(--font-sans, system-ui, sans-serif)";
          const titleLetterSpacing = useSerif ? "0em" : "0.04em";
          const titleFontWeight = useSerif ? 600 : 700;
          return (
            <g
              key={`bldg-text-${i}`}
              transform={`matrix(${CX}, ${CY}, 0, 1, ${t.x}, ${t.y})`}
            >
              {/* CLIENT FEEDBACK — was animating an opacity ramp here
                * via blurReveal so each building text would appear in
                * sync with the belt cascade. Client said the appears-
                * because-it-wasn't-there read wrong. Now visible from
                * the start. The revealDelay field is preserved on the
                * data (BuildingText type) for potential future use,
                * but no longer drives any style here. */}
              {/* Title — supports multi-line via \n in the title
               * string. Each line gets its own <tspan> with dy =
               * titleSize * 1.15 (line-height 1.15 reads cleanly
               * at this scale without crowding the descenders).
               * Single-line titles still render with one tspan, no
               * visual difference from the old single-<text> form. */}
              <text
                x={0}
                y={0}
                fill={titleColor}
                fontSize={titleSize}
                fontWeight={titleFontWeight}
                letterSpacing={titleLetterSpacing}
                textAnchor={textAnchor}
                style={{ fontFamily: titleFontFamily }}
              >
                {titleLines.map((line, j) => (
                  <tspan key={j} x={0} dy={j === 0 ? 0 : titleSize * 1.15}>
                    {line}
                  </tspan>
                ))}
              </text>
              <text
                /* Subtitle baseline sits at (titleSize * 0.8) below
                 * the LAST title baseline. For single-line titles
                 * that's just titleSize*0.8. For multi-line titles
                 * (split on \n) it's pushed down by an extra
                 * (linesAbove * titleSize * 1.15) so the subtitle
                 * clears the entire title block. */
                x={0}
                y={titleSize * 0.8 + (titleLineCount - 1) * titleSize * 1.15}
                fill={subtitleColor}
                fontSize={subtitleSize}
                fontWeight={400}
                textAnchor={textAnchor}
                style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)" }}
              >
                {subtitleLines.map((line, j) => (
                  <tspan key={j} x={0} dy={j === 0 ? 0 : subtitleSize * 1.3}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </g>

      {/* Image overlays — iso-style PNGs placed in viewBox coords.
       *   - floatAmplitude > 0  → infinite bob (smooth up/down loop)
       *   - enterFromX/Y set    → one-shot entrance translate that
       *                           freezes at the final position
       *                           (used for the truck backing up)
       *   - enterFade           → opacity 0 → 1 during the first
       *                           half of the entrance duration
       * Both can run on the same image: the SVG <animateTransform>
       * elements use additive="sum" so the bob layers on top of
       * the entrance once both finish. */}
      <g aria-hidden>
        {floatingImages.map((img, i) => {
          const amp = img.floatAmplitude ?? 4;
          const bobDur = img.floatDuration ?? 4.5;
          const bobDelay = img.floatDelay ?? 0;
          const bobs = amp > 0;
          const hasEnter =
            typeof img.enterFromX === "number" ||
            typeof img.enterFromY === "number";
          const enterFromX = img.enterFromX ?? 0;
          const enterFromY = img.enterFromY ?? 0;
          const enterDur = img.enterDuration ?? 3.5;
          const enterDelay = img.enterDelay ?? 0;
          const enterFade = (img.enterFade ?? true) && hasEnter;
          /* Round-trip mode: truck drives in, dwells at dock, drives
           * back out the way it came, waits offscreen, then repeats
           * indefinitely. Default values keep parity with the truck
           * data set in DEFAULT_FLOATING_IMAGES. */
          const roundTrip = (img.roundTrip ?? false) && hasEnter;
          const dwellDur = img.dwellDuration ?? 5;
          const offDur = img.offDuration ?? 3;
          const cycleDur = enterDur + dwellDur + enterDur + offDur;
          /* Keytime breakpoints for the 5-stop round-trip animation:
           *   t0 = 0                                 start offscreen
           *   t1 = enterDur                          arrived at dock
           *   t2 = t1 + dwellDur                     about to leave
           *   t3 = t2 + enterDur                     arrived offscreen
           *   t4 = t3 + offDur = cycleDur            cycle restart */
          const rtT1 = enterDur / cycleDur;
          const rtT2 = (enterDur + dwellDur) / cycleDur;
          const rtT3 = (enterDur + dwellDur + enterDur) / cycleDur;
          /* Opacity-fade animation: hold at 0 during the delay,
           * then ramp to 1 during the first half of enterDur, then
           * hold at 1. We run this from begin="0s" (not delayed)
           * so the SMIL animation overrides the static opacity
           * attribute from the very first frame — otherwise the
           * static opacity="0" wins during the delay period and
           * the image stays invisible. */
          const totalFadeDur = enterDelay + enterDur;
          /* keyTimes / values for the chained "hold then fade" */
          const tHoldEnd = enterDelay / totalFadeDur;          // end of opacity=0 hold
          const tFadeEnd = (enterDelay + enterDur * 0.55) / totalFadeDur; // end of fade ramp
          /* Resolve the text's font-family CSS var if present. */
          const textFontFamily = !img.text
            ? undefined
            : img.text.fontFamily === "serif"
              ? "var(--font-serif, Georgia, serif)"
              : "var(--font-sans, system-ui, sans-serif)";
          const textAnchor =
            img.text?.align === "center"
              ? "middle"
              : img.text?.align === "right"
                ? "end"
                : "start";
          /* Text rotation is applied around the text's own anchor
           * point — make a transform string only when set. */
          const textTransform =
            img.text && typeof img.text.rotateDeg === "number"
              ? `rotate(${img.text.rotateDeg} ${img.x + img.text.offsetX} ${img.y + img.text.offsetY})`
              : undefined;
          const hasReveal = typeof img.revealDelay === "number";
          return (
            <g
              key={`floating-img-${i}`}
              /* Static base transform that holds the image at its
               * enterFrom offset before the SMIL animation begins.
               * Without this, the <g>'s base transform was identity
               * during the pre-roll (t < enterDelay), which meant
               * the image rendered at its FINAL docked position
               * from page load — the very bug we were chasing
               * ("the truck is still there when we start"). The
               * entrance <animateTransform> below uses additive="sum"
               * with NEGATED values to cancel this static offset
               * over the animation duration, landing the image at
               * (0, 0) — its docked position — when the SMIL ends. */
              transform={
                hasEnter ? `translate(${enterFromX} ${enterFromY})` : undefined
              }
              /* CSS blur-reveal animation when revealDelay is set —
               * image comes into focus from a 6px blur while fading
               * in. enterFade still uses its own SMIL opacity ramp
               * for entrance-translate-tied fades. The two are
               * mutually exclusive in practice (revealDelay = no
               * slide-in, enterFade = with slide-in). */
              style={
                hasReveal
                  ? {
                      animation: `blurReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${img.revealDelay}s both`,
                    }
                  : undefined
              }
            >
              {/* Animations live on the parent <g> so any children
               * (image + text + future shadows) inherit them. The
               * old structure put them inside <image>, which meant
               * the text label couldn't ride along. */}
              {hasEnter && !roundTrip && (
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  /* Animate from (0, 0) to (-enterFromX, -enterFromY).
                   * Combined with the parent <g>'s static translate
                   * (enterFromX, enterFromY), the effective position
                   * starts at (eX, eY) — the offset — and ends at
                   * (0, 0) — the dock — when the SMIL freezes. */
                  values={`0 0; ${-enterFromX} ${-enterFromY}`}
                  keyTimes="0; 1"
                  dur={`${enterDur}s`}
                  begin={`${enterDelay}s`}
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.22 1 0.36 1"
                  additive="sum"
                />
              )}
              {hasEnter && roundTrip && (
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  /* Round-trip loop: drive in → dwell → drive out →
                   * wait → repeat. Values cycle through 5 stops:
                   *   (0,0)           offscreen start (combined with
                   *                   parent's static translate)
                   *   (-eX, -eY)      docked
                   *   (-eX, -eY)      still docked (dwell hold)
                   *   (0, 0)          back offscreen
                   *   (0, 0)          waiting offscreen (off hold)
                   * Splines: ease-out for arrivals, linear holds for
                   * dwell/off segments (the values don't change so
                   * easing is moot, but SMIL requires N-1 splines). */
                  values={`0 0; ${-enterFromX} ${-enterFromY}; ${-enterFromX} ${-enterFromY}; 0 0; 0 0`}
                  keyTimes={`0; ${rtT1.toFixed(4)}; ${rtT2.toFixed(4)}; ${rtT3.toFixed(4)}; 1`}
                  dur={`${cycleDur}s`}
                  begin={`${enterDelay}s`}
                  repeatCount="indefinite"
                  calcMode="spline"
                  /* Arrival spline (0.16 1 0.3 1 — ease-out-quint):
                   * steeper deceleration than the previous quart.
                   * Covers ~83% of the distance in the first 30% of
                   * the duration, then crawls the final stretch —
                   * matches "back up slower as it approaches the
                   * building". Departure (0.64 0 0.78 0) stays as
                   * ease-in so the truck starts slow at the dock
                   * and accelerates away naturally. */
                  keySplines="0.16 1 0.3 1; 0.42 0 0.58 1; 0.64 0 0.78 0; 0.42 0 0.58 1"
                  additive="sum"
                />
              )}
              {enterFade && (
                <animate
                  attributeName="opacity"
                  values={`0; 0; 1; 1`}
                  keyTimes={`0; ${tHoldEnd}; ${tFadeEnd}; 1`}
                  dur={`${totalFadeDur}s`}
                  begin="0s"
                  fill="freeze"
                />
              )}
              {bobs && (
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values={`0 0; 0 ${-amp}; 0 0; 0 ${amp}; 0 0`}
                  keyTimes="0; 0.25; 0.5; 0.75; 1"
                  dur={`${bobDur}s`}
                  begin={`${bobDelay + (hasEnter ? enterDelay + enterDur : 0)}s`}
                  repeatCount="indefinite"
                  calcMode="spline"
                  keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"
                  additive="sum"
                />
              )}
              {(() => {
                const anchorX = img.text ? img.x + img.text.offsetX : 0;
                const anchorY = img.text ? img.y + img.text.offsetY : 0;
                const useWall = typeof img.text?.wallAngleDeg === "number";
                const wallRad = useWall
                  ? (img.text!.wallAngleDeg! * Math.PI) / 180
                  : 0;
                const wCX = Math.cos(wallRad);
                const wCY = Math.sin(wallRad);
                const textEl = img.text ? (
                  <text
                    x={useWall ? 0 : anchorX}
                    y={useWall ? 0 : anchorY}
                    fill={img.text.color}
                    fontSize={img.text.fontSize}
                    fontWeight={img.text.fontWeight ?? 600}
                    letterSpacing={img.text.letterSpacing}
                    textAnchor={textAnchor}
                    style={{ fontFamily: textFontFamily }}
                    transform={useWall ? undefined : textTransform}
                  >
                    {img.text.content}
                  </text>
                ) : null;
                const textNode = img.text
                  ? useWall
                    ? <g transform={`matrix(${wCX}, ${wCY}, 0, 1, ${anchorX}, ${anchorY})`}>{textEl}</g>
                    : textEl
                  : null;
                return (
                  <>
                    {img.shadow && (
                      <>
                        {/* warm bloom halo — copies the conveyor box pile shadow */}
                        <ellipse
                          cx={img.x + img.width / 2}
                          cy={img.y + img.height - 2.5}
                          rx={img.width * 0.6}
                          ry={img.width * 0.19}
                          fill="url(#messa-iso-bloom)"
                          opacity={1.05}
                        />
                        {/* warm cast ellipse, iso-angled + blurred */}
                        <ellipse
                          cx={img.x + img.width / 2}
                          cy={img.y + img.height - 2}
                          rx={img.width * 0.48}
                          ry={img.width * 0.135}
                          fill="rgba(45,30,15,0.5)"
                          transform={`rotate(-30 ${img.x + img.width / 2} ${img.y + img.height - 2})`}
                          style={{ filter: "blur(1.4px)" }}
                        />
                      </>
                    )}
                    <image
                      href={img.src}
                      x={img.x}
                      y={img.y}
                      width={img.width}
                      height={img.height}
                      preserveAspectRatio="xMidYMid meet"
                      transform={img.flipX ? `translate(${img.x * 2 + img.width} 0) scale(-1 1)` : undefined}
                    />
                    {textNode}
                    {img.smoke && [0, 0.74, 1.47].map((delay, pi) => {
                      const smokeCx = img.x + img.width * 0.45;
                      const smokeCy = img.y + img.height * 0.12;
                      const dur = 2.2;
                      const drift = pi % 2 === 0 ? 4 : -3;
                      return (
                        <circle key={pi} cx={smokeCx} cy={smokeCy} r="0" fill="rgb(195,178,158)" opacity="0">
                          <animate attributeName="cy" values={`${smokeCy}; ${smokeCy - 30}`}
                            dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite"
                            calcMode="spline" keySplines="0.25 0 0.5 1" />
                          <animate attributeName="opacity" values="0; 0.45; 0"
                            keyTimes="0; 0.25; 1" dur={`${dur}s`} begin={`${delay}s`}
                            repeatCount="indefinite" />
                          <animate attributeName="r" values="2; 7"
                            dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite"
                            calcMode="spline" keySplines="0.25 0 0.5 1" />
                          <animate attributeName="cx" values={`${smokeCx}; ${smokeCx + drift}`}
                            dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite"
                            calcMode="spline" keySplines="0.25 0 0.5 1" />
                        </circle>
                      );
                    })}
                  </>
                );
              })()}
            </g>
          );
        })}
      </g>

      {/* Intro sign — Messa wordmark on top + four icon-label rows
       * below. Projected onto the iso wall plane via the same
       * matrix as everything else, then scaled uniformly. The
       * Logo paths are imported from /components/Logo so the
       * wordmark always matches the navbar/footer logo exactly. */}
      {showStructure && (() => {
        const s = introSign;
        /* Logo native viewBox is 2826 × 690 — scale to logoHeight. */
        const LOGO_NATIVE_W = 2826;
        const LOGO_NATIVE_H = 690;
        const logoScale = s.logoHeight / LOGO_NATIVE_H;
        const logoW = LOGO_NATIVE_W * logoScale;
        /* Rows start below the logo + gap; each row is (rowGap) tall. */
        const rowsStartY = s.logoHeight + s.logoGap;
        /* CLIENT FEEDBACK — was animating a logoDraw stroke-then-fill
         * sequence on the Messa logo + a per-row blurReveal on each
         * label, all gated by s.revealDelay. Client wanted texts +
         * icons visible from the start. Now the logo and all rows
         * render fully painted on first frame. The revealDelay
         * field is retained on the IntroSign type for potential
         * future use (e.g. an active-pulse signal). */
        return (
          <g
            aria-hidden
            transform={`matrix(${CX * s.scale}, ${CY * s.scale}, 0, ${s.scale}, ${s.x}, ${s.y})`}
          >
            {/* Logo — rendered fully filled, no entry animation. */}
            <g transform={`scale(${logoScale})`}>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d={LOGO_ICON_PATH}
                fill={s.logoIconColor}
              />
              <path
                d={LOGO_WORDMARK_PATH}
                fill={s.logoColor}
              />
            </g>
            {/* Item rows — no entry animation on the labels; the icon
             * components apply their own optional iconActivePulse
             * (defined in SignIconInline) for the active-stage
             * highlight when revealDelay is set. */}
            {s.items.map((item, j) => {
              const rowY = rowsStartY + j * s.rowGap;
              return (
                <g key={`intro-row-${j}`} transform={`translate(0, ${rowY})`}>
                  {/* Icon — centered vertically at rowY by translating
                   * +iconSize/2 down (SignIconInline centers on its
                   * local 0,0). */}
                  <g transform={`translate(${s.iconSize / 2}, ${s.iconSize / 2})`}>
                    <SignIconInline
                      /* Local-bundled tabler icon — see signIconUrl()
                       * comment above for the perf rationale. */
                      url={`/work/messa/hero/icons/tabler/${item.icon}.svg`}
                      color={item.color}
                      size={s.iconSize}
                      /* No pulse on intro-sign rows — those are static
                       * informational lines, not active stages. */
                    />
                  </g>
                  {/* Label — visible from the start. */}
                  <text
                    x={s.iconSize + s.iconLabelGap}
                    y={s.iconSize / 2}
                    fill={s.labelColor}
                    fontSize={s.labelSize}
                    fontWeight={s.labelFont === "serif" ? 500 : 600}
                    dominantBaseline="middle"
                    style={{
                      fontFamily:
                        s.labelFont === "serif"
                          ? "var(--font-serif, Georgia, serif)"
                          : "var(--font-sans, system-ui, sans-serif)",
                    }}
                  >
                    {item.label}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })()}
    </svg>

    {/* Rooftop sign icons — rendered as standalone <img> elements
     * with SVG data-URL src so they never enter the SVG rendering
     * pipeline. Wrapped in a 1614×676 div that mirrors the SVG
     * viewBox coordinate space and is centred vertically in the
     * parent. This keeps the % position maths correct even when the
     * parent container has a taller aspect ratio (e.g. the case-study
     * 1614:1000 stage) — without the wrapper, the icons' `top` %
     * resolves against the taller parent height and the icons land
     * above the sign boards. iOS WebKit cannot reliably render stroked
     * SVG <path> elements inside matrix-transformed groups; the <img>
     * approach bypasses that bug entirely. */}
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: 0,
        width: "100%",
        aspectRatio: "1614 / 676",
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
      }}
    >
      {signIcons
        .filter((s) => (s.paths?.length ?? 0) > 0)
        .map((s, i) => {
          const color = s.color ?? "#5A6B8F";
          const half = s.size / 2;
          const pathsMarkup = (s.paths ?? [])
            .map((d) => `<path d="${d}"/>`)
            .join("");
          const svgSrc =
            "data:image/svg+xml;charset=utf-8," +
            encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"` +
              ` stroke="${color}" stroke-width="1.5" stroke-linecap="round"` +
              ` stroke-linejoin="round">${pathsMarkup}</svg>`,
            );
          return (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={`sign-icon-img-${i}`}
              src={svgSrc}
              alt=""
              aria-hidden
              draggable={false}
              style={{
                position: "absolute",
                left: `${((s.x - half) / 1614) * 100}%`,
                top: `${((s.y - half) / 676) * 100}%`,
                width: `${(s.size / 1614) * 100}%`,
                height: `${(s.size / 676) * 100}%`,
                /* CSS matrix(a,b,c,d,tx,ty) — identical formula to the
                 * SVG wall-plane matrix(CX,CY,0,1,…). The viewBox has
                 * equal x/y pixel density (W/1614 px per unit each), so
                 * the same coefficients apply in CSS pixel space.
                 * transform-origin:center keeps the icon centered on
                 * (s.x, s.y) the same as the SVG approach did. */
                transform: `matrix(${CX},${CY},0,1,0,0)`,
                transformOrigin: "center",
                pointerEvents: "none",
                userSelect: "none",
              }}
            />
          );
        })}
    </div>
    </>
  );
};

export const ConveyorOverlay = memo(ConveyorOverlayImpl);

/* Read-only view of the BELTS array for the in-page belt-path
 * calibrator. The calibrator parses each entry's `d` to seed its
 * anchor points so opening ?calibrate=1 shows the live paths
 * ready to be dragged, instead of an empty canvas. */
export const DEFAULT_BELTS_FOR_CALIBRATOR: ReadonlyArray<{ id: string; d: string }> =
  BELTS.map((b) => ({ id: b.id, d: b.d }));
