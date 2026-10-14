import { cn } from "./cn";

/* Four faces, four jobs (brand book, "Type"). Each row is set in the face
 * it names, saying the kind of thing that face is there to say. */
const FACES = [
  {
    face: "Source Serif 4",
    job: "The voice: entries, headlines, the call-out",
    sample: "You already know.",
    className: "font-serif text-[2.2rem] leading-tight font-light text-ink",
  },
  {
    face: "Caveat",
    job: "The hand: the margin, the marks",
    sample: "— want to look?",
    className: "font-hand text-[2.2rem] leading-tight text-pen",
  },
  {
    face: "Inter",
    job: "The chrome: buttons, settings, the system",
    sample: "Not now · Let's look",
    className: "font-sans text-[1.35rem] leading-tight text-ink",
  },
  {
    face: "IBM Plex Mono",
    job: "The technical: dates, labels, specs",
    sample: "THU 02 JUL · 09 41",
    className: "font-mono text-[1.05rem] tracking-[0.14em] text-body",
  },
] as const;

export const TypeSpecimen = ({ className }: { className?: string }) => (
  <dl className={cn("divide-y divide-rule rounded-[6px] bg-sheet ring-1 ring-rule", className)}>
    {FACES.map((f) => (
      <div key={f.face} className="grid gap-3 p-6 sm:grid-cols-[13rem_1fr] sm:items-center sm:gap-8 sm:p-8">
        <dt>
          <span className="block font-sans text-[0.95rem] text-ink">{f.face}</span>
          <span className="mt-1 block font-sans text-[0.8rem] leading-[1.5] text-body">{f.job}</span>
        </dt>
        <dd className={f.className}>{f.sample}</dd>
      </div>
    ))}
  </dl>
);
