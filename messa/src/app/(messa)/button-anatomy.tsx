import type { CSSProperties } from "react";

/**
 * The tactile 3D CTA that shipped, rebuilt natively (client direction
 * 2026-06-18 — real UI, not a screenshot) and peeled into its layers. Every
 * value is the real `.story-btn-3d` recipe (see story.css). Pure CSS — the
 * composed button is a real <button>: it brightens on hover and sinks on
 * press, live. Vertical layer list so it pairs with the glass anatomy.
 */

const SLATE = "#5A6B8F";

type Layer = { n: string; name: string; does: string; css: string; swatch: CSSProperties; pressed?: boolean };

const LAYERS: readonly Layer[] = [
  { n: "01", name: "Slate base", does: "The body color of the pill.", css: "#5A6B8F", swatch: { background: SLATE } },
  {
    n: "02",
    name: "Top highlight",
    does: "A lit top lip — gives it volume.",
    css: "inset 0 1px 0 rgba(255,255,255,.16)",
    swatch: { background: SLATE, boxShadow: "inset 0 2px 0 rgba(255,255,255,0.30)" },
  },
  {
    n: "03",
    name: "Edge border",
    does: "A darker rim, so it reads raised.",
    css: "1px solid rgba(30,40,60,.32)",
    swatch: { background: SLATE, border: "1px solid rgba(30,40,60,0.55)" },
  },
  {
    n: "04",
    name: "Lift shadow",
    does: "Contact + ambient — it floats off the page.",
    css: "0 1px 2px, 0 4px 10px rgba(20,30,50,.1)",
    swatch: { background: SLATE, boxShadow: "0 2px 3px rgba(20,30,50,0.20), 0 7px 14px rgba(20,30,50,0.18)" },
  },
  {
    n: "05",
    name: "Letterpress type",
    does: "The label, pressed into the surface.",
    css: "text-shadow: 0 -1px 0 rgba(15,25,45,.35)",
    swatch: { background: SLATE },
    pressed: true,
  },
];

export const ButtonAnatomy = ({ className }: { className?: string }) => (
  <figure className={className}>
    {/* The button as it ships — a real, pressable <button>. */}
    <div className="flex flex-col items-center gap-3 rounded-xl border border-[#E8D9C5] bg-[#FBF0E6] px-6 py-9">
      <button
        type="button"
        className="story-btn-3d cursor-pointer rounded-full px-8 py-3 text-[15px] font-medium text-white select-none"
      >
        Request a demo
      </button>
      <span className="font-mono text-[11px] uppercase tracking-widest text-[#8A847D]">
        hover · press
      </span>
    </div>

    {/* The same button, peeled into five layers in one row — each swatch
      * isolates one property; the value underneath is the real recipe. */}
    <ol className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#E8D9C5] bg-[#E8D9C5] sm:grid-cols-5">
      {LAYERS.map((l) => (
        <li
          key={l.n}
          className="flex flex-col items-center gap-1.5 bg-white p-3 text-center"
        >
          <div className="flex h-10 w-16 items-center justify-center rounded-md bg-[#FBF0E6]">
            <div
              className="flex h-6 w-12 items-center justify-center rounded-full"
              style={l.swatch}
            >
              {l.pressed ? (
                <span
                  className="text-[10px] font-medium text-white"
                  style={{ textShadow: "0 -1px 0 rgba(15,25,45,0.55)" }}
                >
                  Aa
                </span>
              ) : null}
            </div>
          </div>
          <span className="mt-1 font-mono text-[10px] text-[#5A6B8F]">{l.n}</span>
          <span className="text-[12px] font-medium leading-4 text-[#0A0A0B]">
            {l.name}
          </span>
          <code className="font-mono text-[9px] leading-[1.3] break-words text-[#8A847D]">
            {l.css}
          </code>
        </li>
      ))}
    </ol>
    <figcaption className="mt-3 text-sm leading-6 text-[#6E6B68]">
      The CTA that shipped, rebuilt natively — five layers, real recipe. Press
      it: it sinks half a pixel, the live <code className="font-mono text-[13px]">:active</code> state.
    </figcaption>
  </figure>
);
