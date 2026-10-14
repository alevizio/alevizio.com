import { cn } from "./cn";
import { PAGE } from "./story";
import { tidy } from "./tidy";

/* The brand book's two type specimens (pp. 05–06), set live in the fonts
 * themselves rather than shown as pictures of them. */

const WEIGHTS = [
  { weight: "font-normal", label: "400 · Regular" },
  { weight: "font-medium", label: "500 · Medium" },
  { weight: "font-semibold", label: "600 · SemiBold" },
  { weight: "font-bold", label: "700 · Bold" },
] as const;

const TOKENS = [
  { token: "Display · 58 / 104 / −2", sample: "You already know.", className: "text-[2.125rem] leading-[1.04] tracking-[-0.02em] sm:text-[3.625rem]" },
  { token: "Headline · 34 / 112 / −1", sample: "It reads you back.", className: "text-[2.125rem] leading-[1.12] tracking-[-0.01em]" },
  {
    token: "Body · 18 / 165 / 0",
    sample: "Told myself I’d deal with the co-founder thing after the launch. That was three launches ago, and the sentence has not changed once.",
    className: "text-[1.125rem] leading-[1.65]",
  },
  { token: "Caption · 14 / 155 / 0", sample: "Shown at true size. No italic, anywhere.", className: "text-[0.875rem] leading-[1.55]" },
] as const;

/** Source Serif 4: the voice, at its four weights and its working sizes. */
export const SerifSpecimen = ({ className }: { className?: string }) => (
  <div className={cn(PAGE, "grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,9fr)] lg:gap-10", className)}>
    <div className="min-w-0">
      <p aria-hidden className="font-serif text-[10rem] leading-none font-normal tracking-[-0.02em] text-ink sm:text-[13rem]">
        Aa
      </p>
      <p className="type-label mt-12 text-pen">Four weights in use</p>
      <ul className="mt-6 space-y-3">
        {WEIGHTS.map((w) => (
          <li key={w.label} className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <span className={cn("font-serif text-[1.625rem] leading-[1.3] whitespace-nowrap text-ink sm:text-[2rem]", w.weight)}>You already know.</span>
            <span className="type-label shrink-0 text-body">{w.label}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="min-w-0">
      <p className="font-serif text-[1.5rem] leading-[1.45] text-body [overflow-wrap:anywhere] sm:text-[2rem]">
        ABCDEFGHIJKLMNOPQRSTUVWXYZ
        <br />
        abcdefghijklmnopqrstuvwxyz
        <br />
        0123456789 &amp;@£$€% .,;:!?‘’“”—–()[]
      </p>
      <div className="mt-8 space-y-8 border-t border-rule pt-10">
        {TOKENS.map((t) => (
          <div key={t.token}>
            <p className="type-label text-body">{t.token}</p>
            <p className={cn("mt-2 font-serif text-ink", t.className)}>{t.sample}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FACES = [
  {
    face: "Caveat",
    role: "The hand · the name, Pausa’s own asides",
    rule: "Never body copy. Never more than a line. Blue, at a size that reads as writing rather than type.",
    aa: "font-hand font-bold",
    set: "font-hand text-[1.75rem] text-body",
    sample: <span className="font-hand text-[2.25rem] font-bold text-pen">want to look?</span>,
  },
  {
    face: "Inter",
    role: "The chrome · buttons, tab bars, form labels",
    rule: "The interface, not the writing. Medium for anything tappable, Regular for the rest.",
    aa: "font-sans",
    set: "font-sans text-[1.5rem] text-body",
    sample: (
      <span className="font-sans text-[1.25rem] font-medium text-ink">
        Not now <span className="px-2 text-muted">·</span> Let’s look
      </span>
    ),
  },
  {
    face: "IBM Plex Mono",
    role: "Technical · dates, counts, spec labels",
    rule: "Data, not decoration. Uppercase with 10–12% tracking for labels; never a heading, never a paragraph.",
    aa: "font-mono",
    set: "font-mono text-[1.5rem] text-body",
    sample: <span className="font-mono text-[1.25rem] tracking-[0.12em] text-ink">TUE 30 JUN · 01 SEC</span>,
  },
] as const;

/** Caveat, Inter, IBM Plex Mono: each face, its one job, and a line in it. */
export const FaceSpecimens = ({ className }: { className?: string }) => (
  <div className={cn(PAGE, className)}>
    {FACES.map((f) => (
      <div
        key={f.face}
        className="grid gap-6 border-t border-rule py-10 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,5fr)_minmax(0,2fr)_minmax(0,9fr)] md:items-center md:gap-10"
      >
        <div>
          <p className="font-serif text-[1.75rem] leading-[1.15] font-semibold tracking-[-0.01em] text-ink lg:text-[2rem]">{f.face}</p>
          <p className="type-label mt-2 text-pen">{f.role}</p>
          <p className="type-secondary mt-4 max-w-[26rem] text-body">{tidy(f.rule)}</p>
        </div>
        <p aria-hidden className={cn("text-[5.5rem] leading-none text-ink", f.aa)}>
          Aa
        </p>
        <div>
          <p className={cn("leading-[1.4]", f.set)}>ABCDEFGHIJKLM abcdefghijklm 0123456789</p>
          <p className="mt-4">{f.sample}</p>
        </div>
      </div>
    ))}
  </div>
);
