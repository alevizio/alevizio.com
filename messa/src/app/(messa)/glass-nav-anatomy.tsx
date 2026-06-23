import type { CSSProperties } from "react";
import { MessaLogo } from "./messa-logo";

/**
 * The floating glass nav, rebuilt natively (client direction 2026-06-18 —
 * real UI, not a screenshot) and peeled into the layers that make it read as
 * glass. Every value is the production token from the brand's glass surface
 * (globals.css: --color-glass-bg, --shadow-glass, --color-glass-border).
 * Vertical layer list so it pairs side-by-side with the 3D-button anatomy.
 */

const GLASS: CSSProperties = {
  background: "rgba(255,255,255,0.62)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(15,23,42,0.12)",
  boxShadow:
    "0 8px 32px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.95), inset 0 -1px 1px rgba(0,0,0,0.03)",
};

type Layer = { n: string; name: string; does: string; css: string; swatch: CSSProperties };

const LAYERS: readonly Layer[] = [
  {
    n: "01",
    name: "Translucent fill",
    does: "Lets the sky read through the bar.",
    css: "rgba(255,255,255,.62)",
    swatch: { background: "rgba(255,255,255,0.62)" },
  },
  {
    n: "02",
    name: "Backdrop blur",
    does: "Frosts whatever scrolls behind it.",
    css: "blur(12px)",
    swatch: {
      background: "rgba(255,255,255,0.28)",
      backdropFilter: "blur(5px)",
      WebkitBackdropFilter: "blur(5px)",
    },
  },
  {
    n: "03",
    name: "Inset highlight",
    does: "A lit top edge — the catch of light.",
    css: "inset 0 1px rgba(255,255,255,.95)",
    swatch: {
      background: "rgba(255,255,255,0.5)",
      boxShadow: "inset 0 2px 1px rgba(255,255,255,0.95)",
    },
  },
  {
    n: "04",
    name: "Hairline border",
    does: "Defines the glass against the sky.",
    css: "1px solid rgba(15,23,42,.12)",
    swatch: { background: "rgba(255,255,255,0.5)", border: "1px solid rgba(15,23,42,0.12)" },
  },
  {
    n: "05",
    name: "Lift shadow",
    does: "Floats the bar off the page.",
    css: "0 8px 32px rgba(0,0,0,.08)",
    swatch: { background: "rgba(255,255,255,0.72)", boxShadow: "0 8px 22px rgba(0,0,0,0.12)" },
  },
];

const DotField = ({ small }: { small?: boolean }) => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0"
    style={{
      backgroundImage: "radial-gradient(rgba(90,107,143,0.32) 1px, transparent 1.5px)",
      backgroundSize: small ? "9px 9px" : "16px 16px",
    }}
  />
);

export const GlassNavAnatomy = ({ className }: { className?: string }) => (
  <figure className={className}>
    {/* The bar over the sky it actually lives on — the dotted field is what
      * the fill and the blur act on. */}
    <div className="relative overflow-hidden rounded-xl border border-[#E8D9C5] bg-[linear-gradient(180deg,#D4E3F0_0%,#E2E9F0_100%)] px-5 py-9">
      <DotField />
      <nav
        className="relative mx-auto flex max-w-xl items-center justify-between gap-3 rounded-full px-4 py-2.5"
        style={GLASS}
      >
        <MessaLogo height={16} />
        <div className="hidden items-center gap-5 text-[12px] text-[#0A0A0B]/75 sm:flex">
          <span>Product</span>
          <span>About</span>
          <span className="text-[#0A0A0B]/55">Log in</span>
        </div>
        <span className="rounded-full bg-[#5A6B8F] px-3.5 py-1.5 text-[12px] font-medium text-white shadow-sm">
          Request demo
        </span>
      </nav>
    </div>

    {/* The layers, peeled apart in one row — each swatch isolates one property
      * over the same dotted sky, with the real token underneath. */}
    <ol className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#E8D9C5] bg-[#E8D9C5] sm:grid-cols-5">
      {LAYERS.map((l) => (
        <li
          key={l.n}
          className="flex flex-col items-center gap-1.5 bg-white p-3 text-center"
        >
          <div className="relative h-10 w-16 overflow-hidden rounded-md bg-[linear-gradient(180deg,#D4E3F0,#E2E9F0)]">
            <DotField small />
            <div className="absolute inset-2 rounded" style={l.swatch} />
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
      The floating glass nav, rebuilt natively — five layers, every value the
      production token.
    </figcaption>
  </figure>
);
