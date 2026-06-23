import { cn } from "./cn";

/**
 * The rules of the hand-drawn world — the governing principles every layer,
 * icon and screen had to obey for the whole thing to read as one place. Opens
 * the Art Direction chapter (client direction 2026-06-22); the sections below
 * break the world into atoms (type, color, icons). Themed in the story's cream
 * palette, like the rest of the case study.
 */
type Rule = {
  /** The keyword or value, set in mono as the kicker. */
  kicker: string;
  title: string;
  body: string;
  /** Optional color chips — used by the palette rule. */
  swatches?: readonly string[];
};

const RULES: readonly Rule[] = [
  {
    kicker: "26.57°",
    title: "One isometric angle",
    body: "Every wall, belt and shadow is drawn on the same true-iso pitch. Nothing in the world tilts off it.",
  },
  {
    kicker: "One light",
    title: "Lit once, never rendered",
    body: "Flat cel shadows, no gradients, no realism — the whole scene is lit from a single direction, like a painted set.",
  },
  {
    kicker: "Ink",
    title: "A single outline weight",
    body: "One hand-drawn line wraps every shape, so a CV crate and a button feel drawn by the same hand.",
  },
  {
    kicker: "Paper",
    title: "Cream, and one slate accent",
    body: "Color is rationed: warm paper everywhere, a single slate for whatever matters. Nothing else competes.",
    swatches: ["#FBF0E6", "#5A6B8F"],
  },
  {
    kicker: "Grain",
    title: "Real paper on everything",
    body: "Scanned-paper texture sits over the entire world — even the product UI — so nothing reads as vector-perfect.",
  },
  {
    kicker: "Weather",
    title: "A place that's alive",
    body: "Clouds drift and the sky shifts dawn to day. It's a world with weather, not a flat backdrop.",
  },
];

export const WorldRules = ({ className }: { className?: string }) => (
  <section
    aria-label="Rules of the hand-drawn world"
    className={cn("mx-auto max-w-3xl px-6", className)}
  >
    <ol className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
      {RULES.map((rule) => (
        <li key={rule.title} className="border-t border-[#E8D9C5] pt-4">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#5A6B8F]">
            {rule.kicker}
            {rule.swatches ? (
              <span className="flex items-center gap-1">
                {rule.swatches.map((c) => (
                  <span
                    key={c}
                    aria-hidden
                    className="h-3 w-3 rounded-full border border-black/10"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </span>
            ) : null}
          </p>
          <h3 className="story-serif mt-2 text-lg tracking-tight text-[#0A0A0B]">
            {rule.title}
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-[#6E6B68]">{rule.body}</p>
        </li>
      ))}
    </ol>
  </section>
);
