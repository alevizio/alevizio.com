/* eslint-disable @next/next/no-img-element -- the book's own strokes, as SVG */
import { cn } from "./cn";
import { PenMark } from "./pen-mark";
import { PAGE } from "./story";
import { tidy } from "./tidy";

/* Colour the way the brand book lays it out (p. 03): the three primaries as
 * the things they are, a paper swipe, the pen's strokes and the highlighter
 * over them, with the rules beside them and the neutrals underneath. */

const PRIMARIES = [
  { name: "Paper", hex: "#ECECEE", role: "The page, and the app’s background." },
  { name: "Pen", hex: "#172CA3", role: "The accent: marks, links, CTAs. 5% at most." },
  { name: "Highlighter", hex: "#FFD23F", role: "The highlighter, behind ink only." },
] as const;

const RULES = [
  {
    title: <span className="text-pen">The blue is a voice.</span>,
    text: "It appears where Pausa speaks: the call-out, the aside, the underline, the marks, plus one CTA per screen. Never chrome, never decoration.",
    label: "≤ 5% of any surface",
  },
  {
    // Sun is never a text colour: the yellow goes behind the word instead.
    title: (
      <>
        <PenMark kind="highlight">Yellow</PenMark> is attention.
      </>
    ),
    text: "One highlight per screen: the single line worth noticing. It sits behind ink, never on it, and never on Pausa’s own words.",
    label: "Max 1 / screen",
  },
  {
    title: "Everything else is paper.",
    text: "Text, dividers, most buttons. Recurring CTAs are ink; blue means Pausa is speaking. Meaning never rests on colour alone.",
    label: "≈ 95% of every screen",
  },
] as const;

const NEUTRALS = [
  { hex: "#F7F7F8", name: "Panel", role: "cards", swatch: "bg-panel" },
  { hex: "#F1F1F3", name: "Panel 2", role: "groups", swatch: "bg-[#f1f1f3]" },
  { hex: "#E4E4E7", name: "Rule", role: "hairlines", swatch: "bg-rule" },
  { hex: "#B7B7BC", name: "Ash", role: "dividers", swatch: "bg-ash" },
  { hex: "#8C8C93", name: "Muted", role: "metadata", swatch: "bg-muted" },
  { hex: "#54545B", name: "Ink soft", role: "body", swatch: "bg-body" },
  { hex: "#1A1A1D", name: "Ink", role: "text, icons", swatch: "bg-ink" },
] as const;

export const Colours = ({ className }: { className?: string }) => (
  <div className={cn(PAGE, className)}>
    <div className="grid gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-14">
      <div>
        <p className="type-label text-body">Primaries</p>
        <div aria-hidden className="relative mt-8 h-[4.5rem] sm:h-[6.5rem]">
          <img src="/colour/paper-swipe.svg" alt="" className="mark-multiply absolute top-[30%] left-0 h-[42%] w-[66%] opacity-70" />
          <img src="/colour/pen-and-highlighter.svg" alt="" className="mark-multiply absolute top-0 right-0 h-full w-[52%]" />
        </div>
        <ul className="mt-8 grid gap-6 sm:grid-cols-3">
          {PRIMARIES.map((c) => (
            <li key={c.name}>
              <p className="font-serif text-[1.375rem] font-medium text-ink">{c.name}</p>
              <p className="type-label mt-1 text-pen">{c.hex}</p>
              <p className="type-secondary mt-1 text-body">{tidy(c.role)}</p>
            </li>
          ))}
        </ul>
      </div>
      <ul className="space-y-10">
        {RULES.map((r) => (
          <li key={r.label}>
            <p className="font-serif text-[1.375rem] leading-[1.3] font-semibold text-ink">{r.title}</p>
            <p className="mt-2 font-sans text-[0.95rem] leading-[1.6] text-body">{r.text}</p>
            <p className="type-label mt-3 text-pen">{r.label}</p>
          </li>
        ))}
      </ul>
    </div>

    <p className="type-label mt-20 text-body">Secondaries</p>
    <ul className="mt-6 grid grid-cols-2 gap-x-1 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
      {NEUTRALS.map((n) => (
        <li key={n.hex}>
          <div className={cn("h-7 ring-1 ring-rule ring-inset", n.swatch)} />
          <p className="type-label mt-4 text-pen">{n.hex}</p>
          <p className="type-caption mt-1 pr-3 whitespace-nowrap text-body">
            {n.name}: {n.role}
          </p>
        </li>
      ))}
    </ul>
  </div>
);
