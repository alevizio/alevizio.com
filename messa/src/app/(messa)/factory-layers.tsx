"use client";

import { useState, type ReactNode } from "react";
import { cn } from "./cn";
import {
  ConveyorOverlay,
  DEFAULT_FLOATING_IMAGES,
  DEFAULT_GROUND_SHADOWS,
  DEFAULT_TRUCK_PAD,
  DEFAULT_TRUCK_PAD_OUT,
} from "./conveyor-overlay";

/**
 * The REAL Messa hero, rebuilt at full size and animated, with each layer
 * on its own toggle (client direction 2026-06-15). This ports the live
 * conveyor-overlay (belts + CV cards + wall signs + steam + the trucks and
 * characters doing their SMIL round-trips) over the factory raster, under
 * drifting clouds and a paper-grain multiply — the same composition the
 * shipped hero uses, sized to its 1500px max width.
 *
 * Toggle gating (12 layers, all default on):
 *  - sky / clouds / factory / texture: mounted/unmounted at this level.
 *  - trucks / characters: filter the overlay's `floatingImages` prop —
 *    trucks are the FloatingImages whose label starts "Truck", everything
 *    else (incl. the interview-table coffee-mug props, which ride with the
 *    interview vignette) is a character.
 *  - boxes:      `showBoxes`     — the CV cards riding the belts.
 *  - masks:      `maskBoxes`     — whether those cards are clipped by the
 *                wall occluders (a no-op when boxes is off, so the pill is
 *                disabled in that state).
 *  - gradients:  `showGradients` — the pulsing amber stage-zone glows.
 *  - typography: `buildingTexts` ([] when off) — the wall titles.
 *  - signs:      `showStructure` (intro sign) + `signIcons` ([] when off,
 *                the rooftop station icons).
 *  - shadows:    `doorShadows` ([] when off) + the sidewalk ground shadows
 *                in `isoRects`. The two TRUCK pads are composed into
 *                `isoRects` only when shadows AND trucks are both on, so a
 *                truck shadow never slides across empty pavement.
 *  The main <svg> stays mounted regardless so the SMIL clocks keep running.
 */

type LayerKey =
  | "sky"
  | "clouds"
  | "factory"
  | "boxes"
  | "masks"
  | "gradients"
  | "typography"
  | "signs"
  | "shadows"
  | "trucks"
  | "characters"
  | "texture";

/* Layers grouped by what they are, stacked roughly back-to-front like
 * a Figma layer panel: the sky sits behind everything, the paper grain
 * on top. Dependent layers stay adjacent (Masks under Boxes, the
 * Gradients glow with the Factory it lights). */
type LayerGroup = {
  title: string;
  items: readonly { key: LayerKey; label: string }[];
};

const LAYER_GROUPS: readonly LayerGroup[] = [
  {
    title: "Backdrop",
    items: [
      { key: "sky", label: "Sky" },
      { key: "clouds", label: "Clouds" },
    ],
  },
  {
    title: "Factory",
    items: [
      { key: "factory", label: "Factory" },
      { key: "shadows", label: "Shadows" },
      { key: "gradients", label: "Gradients" },
    ],
  },
  {
    title: "Conveyor",
    items: [
      { key: "boxes", label: "Boxes" },
      { key: "masks", label: "Masks" },
    ],
  },
  {
    title: "Cast",
    items: [
      { key: "trucks", label: "Trucks" },
      { key: "characters", label: "Characters" },
    ],
  },
  {
    title: "Signage",
    items: [
      { key: "signs", label: "Signs" },
      { key: "typography", label: "Typography" },
    ],
  },
  {
    title: "Finish",
    items: [{ key: "texture", label: "Paper grain" }],
  },
];

/* Hero clouds — desktop values from messa-landing DEFAULT_HERO_CLOUDS,
 * drifting on the heroCloudA–F keyframes (in story.css). Positioned as a
 * share of the 1500px illustration box, like the live hero. */
type Cloud = {
  src: string;
  w: number;
  top: string;
  left?: string;
  right?: string;
  anim: string;
  dur: number;
  delay: number;
};

const CLOUDS: readonly Cloud[] = [
  { src: "cloud02.png", w: 250, top: "3.6%", left: "10.0%", anim: "heroCloudA", dur: 26, delay: 0 },
  { src: "cloud01.png", w: 230, top: "2.5%", right: "4.4%", anim: "heroCloudD", dur: 30, delay: 2 },
  { src: "cloud02.png", w: 150, top: "29.0%", left: "9.6%", anim: "heroCloudE", dur: 24, delay: 4 },
  { src: "cloud04.png", w: 175, top: "20.6%", right: "12.4%", anim: "heroCloudC", dur: 28, delay: 1.5 },
  { src: "cloud01.png", w: 120, top: "27.3%", left: "-11.8%", anim: "heroCloudC", dur: 27, delay: 8 },
  { src: "cloud03.png", w: 150, top: "37.5%", right: "-1.8%", anim: "heroCloudA", dur: 31, delay: 5 },
  { src: "cloud05.png", w: 78, top: "3.5%", left: "-8%", anim: "heroCloudB", dur: 22, delay: 6 },
  { src: "cloud01.png", w: 98, top: "4.2%", right: "-8.7%", anim: "heroCloudF", dur: 25, delay: 3 },
];

export const FactoryLayers = ({
  className,
  headingId,
  heading,
  intro,
}: {
  className?: string;
  /** Anchor id for the in-sky section title (preserves deep links). */
  headingId?: string;
  /** Section title, rendered in the stage's sky above the factory. */
  heading?: ReactNode;
  /** Short intro paragraph rendered under the title. */
  intro?: ReactNode;
}) => {
  const [on, setOn] = useState<Record<LayerKey, boolean>>({
    sky: true,
    clouds: true,
    factory: true,
    boxes: true,
    masks: true,
    gradients: true,
    typography: true,
    signs: true,
    shadows: true,
    trucks: true,
    characters: true,
    texture: true,
  });
  const toggle = (key: LayerKey) =>
    setOn((state) => ({ ...state, [key]: !state[key] }));

  /* Panel chrome (client direction 2026-06-16): a whole-panel minimize
   * toggle + a per-group accordion. Groups all start open. */
  const [minimized, setMinimized] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const g of LAYER_GROUPS) init[g.title] = true;
    return init;
  });
  const toggleGroup = (title: string) =>
    setOpenGroups((state) => ({ ...state, [title]: !state[title] }));

  // Trucks vs characters: filter the overlay's floating images by label.
  const visibleFloating = DEFAULT_FLOATING_IMAGES.filter((f) =>
    f.label?.startsWith("Truck") ? on.trucks : on.characters,
  );

  return (
    <div className={className}>
      {/* The stage spans edge to edge — no max width. */}
      <div className="w-full overflow-x-clip">
        <div className="relative w-full">
          {on.sky ? (
            <div
              aria-hidden
              className="absolute inset-0 z-0 bg-[linear-gradient(180deg,#D4E3F0_0%,#D4E3F0_58%,#E4E6E2_72%,#F0E6D8_82%,#FBF0E6_92%)]"
            />
          ) : null}

          {on.clouds ? (
            <div aria-hidden className="absolute inset-0 z-[1] overflow-hidden">
              {CLOUDS.map((c, i) => (
                <img
                  key={i}
                  aria-hidden
                  src={`/work/messa/hero/${c.src}`}
                  alt=""
                  decoding="async"
                  className="factory-hero-cloud absolute select-none"
                  style={{
                    width: c.w,
                    height: "auto",
                    top: c.top,
                    ...(c.left !== undefined ? { left: c.left } : {}),
                    ...(c.right !== undefined ? { right: c.right } : {}),
                    animation: `cloudEntry 1.8s ease-out ${0.2 + i * 0.12}s both, ${c.anim} ${c.dur}s ease-in-out ${c.delay}s infinite`,
                  }}
                />
              ))}
            </div>
          ) : null}

          {/* Section title, set into the stage's sky above the factory
            * (client direction 2026-06-16). In normal flow so it makes the
            * stage taller; transparent so the gradient + clouds read behind
            * it. z-[4] keeps it over the clouds. */}
          {heading || intro ? (
            <div className="relative z-[4] mx-auto max-w-2xl px-6 pt-14 pb-10 text-center sm:pt-20 sm:pb-12">
              {heading ? (
                <h2
                  id={headingId}
                  className="story-serif scroll-mt-28 text-3xl tracking-tight text-[#0A0A0B] sm:text-4xl"
                >
                  {heading}
                </h2>
              ) : null}
              {intro ? (
                <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#4C586E]">
                  {intro}
                </p>
              ) : null}
            </div>
          ) : null}

          {/* Factory area — the control panel overlays its top-left, so it
            * sits over the factory (below the title) rather than the sky.
            * pb adds a cream band BELOW the trucks so the bottom fade has
            * room to blend without cropping them. */}
          <div className="relative pb-[2%]">
          {/* Sticky layer-control rail (client direction 2026-06-16): a
            * full-height, pointer-events-none column down the left of the
            * illustration. The panel inside is `sticky`, so it rides the
            * top of the viewport while the factory is on screen and
            * releases at the end of the illustration. The panel has a
            * minimize toggle, and each group is its own accordion. z-[7]
            * keeps it above the paper grain (z-5) + bottom fade (z-6). */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-[7] w-[178px] sm:w-[196px]">
            <div
              role="group"
              aria-label="Toggle factory layers"
              className="pointer-events-auto sticky top-4 ml-3 mt-3 w-[154px] rounded-xl border border-[#E8D9C5] bg-white/85 shadow-sm backdrop-blur-sm sm:top-6 sm:ml-6 sm:mt-6 sm:w-[168px]"
            >
              {/* Header — layers icon + title with a minimize toggle. A
                * divider sits below it while the panel is expanded. The
                * px-3 here matches the group rows so the minimize chevron
                * and every accordion chevron share one vertical column. */}
              <div
                className={cn(
                  "flex items-center justify-between gap-2 px-3 py-2",
                  !minimized && "border-b border-[#EFE6D8]",
                )}
              >
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#A3A19E]">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#5A6B8F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                    className="shrink-0"
                  >
                    <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                  </svg>
                  Layers
                </span>
                <button
                  type="button"
                  onClick={() => setMinimized((m) => !m)}
                  aria-expanded={!minimized}
                  aria-label={
                    minimized ? "Expand layers panel" : "Minimize layers panel"
                  }
                  className="rounded p-0.5 text-[#A3A19E] transition-colors hover:bg-black/[0.05] hover:text-[#6E6B68]"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                    className={cn(
                      "transition-transform",
                      minimized ? "rotate-180" : "",
                    )}
                  >
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                </button>
              </div>

              {minimized ? null : (
                <div className="py-1">
                  {LAYER_GROUPS.map((group) => {
                    const open = openGroups[group.title];
                    return (
                      <div key={group.title}>
                        {/* Accordion header — collapses this group's rows. */}
                        <button
                          type="button"
                          onClick={() => toggleGroup(group.title)}
                          aria-expanded={open}
                          className="flex w-full items-center justify-between rounded px-3 py-1 text-left transition-colors hover:bg-black/[0.03]"
                        >
                          <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9C3BA]">
                            {group.title}
                          </span>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                            className={cn(
                              "text-[#C9C3BA] transition-transform",
                              open ? "" : "-rotate-90",
                            )}
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </button>
                        {open ? (
                          <div className="flex flex-col gap-0.5 pb-1">
                            {group.items.map((layer) => {
                              /* Masks only clips the CV cards, so it's a no-op
                               * when Boxes is off (the card group is unmounted
                               * entirely). Disable the row so it doesn't read
                               * as broken. */
                              const disabled =
                                layer.key === "masks" && !on.boxes;
                              return (
                                <button
                                  key={layer.key}
                                  type="button"
                                  onClick={() => toggle(layer.key)}
                                  aria-pressed={on[layer.key]}
                                  disabled={disabled}
                                  title={
                                    disabled
                                      ? "Turn Boxes on to clip them with Masks"
                                      : undefined
                                  }
                                  className={cn(
                                    "flex w-full items-center gap-2 rounded-md px-3 py-1 text-left font-mono text-[11px] uppercase tracking-wider transition-colors",
                                    disabled
                                      ? "cursor-not-allowed text-[#CFC9C0]"
                                      : on[layer.key]
                                        ? "text-[#5A6B8F] hover:bg-[#5A6B8F]/10"
                                        : "text-[#BDB9B3] hover:bg-black/[0.03] hover:text-[#6E6B68]",
                                  )}
                                >
                                  {on[layer.key] ? (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
                                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                      <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                  ) : (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
                                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                                      <line x1="2" x2="22" y1="2" y2="22"/>
                                    </svg>
                                  )}
                                  <span className="truncate">{layer.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* The illustration box — fixed 1614:676 aspect so it holds its
            * height even with the factory raster toggled off; img + overlay
            * pan together via the .factory-hero-illustration media rules. */}
          <div className="factory-hero-illustration isolate relative z-[2] aspect-[1614/1000] w-full select-none">
            {on.factory ? (
              <img
                src="/work/messa/hero/factory-blank.webp"
                srcSet="/work/messa/hero/factory-blank-md.webp 1024w, /work/messa/hero/factory-blank.webp 1614w"
                sizes="(max-width: 1024px) 100vw, 1500px"
                alt="Messa hiring factory: prepare, interview, decide"
                width={1614}
                height={676}
                decoding="async"
                draggable={false}
                className="absolute inset-0 h-full w-full select-none object-contain"
              />
            ) : null}

            <ConveyorOverlay
              floatingImages={visibleFloating}
              showBoxes={on.boxes}
              maskBoxes={on.masks}
              showGradients={on.gradients}
              /* Demo only: freeze + boost the stage-zone glows so the
               * Gradients toggle is obviously visible (the hero keeps
               * its subtle staggered pulse). */
              glowSteady
              showStructure={on.signs}
              buildingTexts={on.typography ? undefined : []}
              signIcons={on.signs ? undefined : []}
              doorShadows={on.shadows ? undefined : []}
              /* Ground (sidewalk) shadows follow Shadows; the two truck
               * pads follow BOTH Shadows AND Trucks so a truck shadow
               * never slides across empty pavement with no truck above
               * it (and a truck never floats with no ground contact). */
              isoRects={[
                ...(on.shadows && on.trucks
                  ? [DEFAULT_TRUCK_PAD, DEFAULT_TRUCK_PAD_OUT]
                  : []),
                ...(on.shadows ? DEFAULT_GROUND_SHADOWS : []),
              ]}
            />

          </div>
          </div>

          {/* Paper grain over the WHOLE stage (client direction
            * 2026-06-16): the sky, the title and the factory all share
            * one grain, so the control panel is the only crisp element.
            * pointer-events-none keeps the toggles clickable through it.
            * The grain FADES IN over the top 8% so it doesn't begin on a
            * hard line where the "The website" divider's (grain-free) sky
            * meets this stage — the two skies read as one continuous grain. */}
          {on.texture ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[5] bg-[url(/work/messa/world/paper-texture.webp)] bg-cover bg-center opacity-[0.26] mix-blend-multiply [mask-image:linear-gradient(180deg,transparent,#000_8%)] [-webkit-mask-image:linear-gradient(180deg,transparent,#000_8%)]"
            />
          ) : null}

          {/* Bottom fade — dissolves the factory's lower edge into the
            * page's cream background (#FBF0E6) so the stage doesn't end on
            * a hard line. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-[12%] bg-[linear-gradient(180deg,transparent_0%,transparent_38%,rgba(251,240,230,0.55)_70%,#FBF0E6_100%)]"
          />
        </div>
      </div>
    </div>
  );
};
