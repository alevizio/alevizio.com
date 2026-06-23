import { ScrollReveal } from "./scroll-reveal";
import { ScrollFocus } from "./scroll-focus";

/* "Core sample" — the six decisions as strata drilled down from the product
 * surface. The ground cross-section is a background layer pulled up so the
 * grass meets the sky and the soil dissolves into the section's soil-brown;
 * the content rides UP over that soil (z-10). Cream/light content + light
 * dashed survey lines contrast against the dark earth. No cards.
 *
 * The dig trigger + collapse were removed (client direction 2026-06-18): the
 * strata are always visible, and the section stays solid soil at the bottom so
 * it flows straight into the "Underneath" chapter below — one continuous,
 * unified underground rather than two separate brown zones. */
const STRATA = [
  {
    n: "01",
    depth: "−1m",
    title: "Criteria built per role",
    body: "Messa works out what each role actually needs before anyone gets scored. Seniority at a Series A isn't seniority at a Fortune 500.",
  },
  {
    n: "02",
    depth: "−2m",
    title: "Nothing it can't point to",
    body: "Every score traces back to a specific line in the candidate's own material. Messa won't make a claim it can't source.",
  },
  {
    n: "03",
    depth: "−3m",
    title: "Same shape every time",
    body: "Every evaluation comes out in the same structure, never loose text. A whole search stays comparable, whoever ran the interview.",
  },
  {
    n: "04",
    depth: "−4m",
    title: "Catches the fakes",
    body: "Messa screens for fabricated applications: timelines that don't add up, phrasing repeated across unrelated candidates, credentials that fall apart on a second look.",
  },
  {
    n: "05",
    depth: "−5m",
    title: "Reads words, not faces",
    body: "Never voice, face, or expression. Just what a candidate said and wrote. Reading competence off tone is a known way to smuggle in bias.",
  },
  {
    n: "06",
    depth: "−6m",
    title: "Gets sharper as you go",
    body: "Every interview and outcome gets linked back to who actually worked out. A chatbot forgets the second it ends. Messa keeps all of them to sharpen the next call. The one piece that compounds.",
  },
];

const SAND = "#CFB58B"; // warm accent: numbers, ticks, node dots
const DASH = "rgba(245,236,222,0.28)"; // light survey lines + borehole axis on the brown

/* One stratum row: full-bleed survey line + (number/depth gutter | title/body). */
const Stratum = ({ s }: { s: (typeof STRATA)[number] }) => (
  <div className="relative">
    {/* full-bleed dashed survey line — spans the whole viewport */}
    <div
      aria-hidden
      className="absolute top-0 border-t border-dashed pointer-events-none"
      style={{ borderColor: DASH, left: "calc(50% - 50vw)", width: "100vw" }}
    />
    <div className="grid grid-cols-[60px_1fr] md:grid-cols-[88px_1fr] pt-5 md:pt-6 pb-7 md:pb-9">
      {/* gutter: index + depth marker */}
      <div className="pr-4 text-right tabular-nums">
        <div className="font-serif text-2xl md:text-3xl leading-snug" style={{ color: SAND }}>
          {s.n}
        </div>
        <div className="text-[10px] mt-1 text-[#FBF0E6]/45">{s.depth}</div>
      </div>
      {/* title | supporting line */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] gap-x-8 gap-y-1.5 pl-3 md:pl-4">
        <h3 className="font-serif text-2xl md:text-3xl leading-snug text-[#FBF0E6]">
          {s.title}
        </h3>
        <p className="text-sm md:text-[15px] leading-relaxed text-pretty text-[#FBF0E6]/75">
          {s.body}
        </p>
      </div>
    </div>
  </div>
);

export const DecisionsSection = () => (
  <section
    className="relative pt-20 pb-16 md:pt-28 md:pb-24"
    style={{
      isolation: "isolate",
      // Solid soil: the section flows straight into the Underneath chapter
      // below (one continuous underground), instead of dissolving to cream.
      background: "#45331F",
    }}
  >
    {/* Ground cross-section as a background layer (z-0): grass meets the
        Product's lower sky above the section; soil masked to dissolve into the
        brown. The content (z-10) rides up over the soil. loading=lazy keeps
        this 1MB+ below-the-fold background out of the SSR preload set. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/images/ground.png"
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      className="absolute left-0 z-0 w-full h-auto select-none pointer-events-none"
      style={{
        top: "-12vw",
        maskImage:
          "linear-gradient(to bottom, #000 50%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.15) 88%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, #000 50%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.15) 88%, transparent 100%)",
      }}
    />

    <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
      <ScrollReveal>
        <ScrollFocus className="max-w-2xl mb-10 md:mb-14">
          <p className="inline-block mb-4 rounded-full px-4 py-1.5 text-sm font-medium tracking-[0.025em] border border-white/20 bg-white/[0.08] text-[#FBF0E6]">
            Underneath the workflow
          </p>
          <h2 className="text-heading font-normal tracking-tight font-serif text-pretty">
            <span className="text-[#FBF0E6]">
              The features you can see are the surface.{" "}
            </span>
            <span className="text-[#FBF0E6]/50">
              These are the decisions underneath them.
            </span>
          </h2>
        </ScrollFocus>
      </ScrollReveal>

      {/* The six strata, always visible (no dig trigger). */}
      <ScrollReveal>
        <div>
          {/* surface caption at 0m — sits above where the borehole begins */}
          <div className="flex items-center justify-between pl-[72px] md:pl-[104px] pr-1 mb-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#FBF0E6]/55">
            <span>0m · the surface</span>
            <span aria-hidden>deeper ↓</span>
          </div>

          <div className="relative">
            {/* vertical dashed "borehole" axis — fades in at the top, out at
                the bottom. */}
            <div
              aria-hidden
              className="absolute top-0 bottom-0 left-[60px] md:left-[88px] border-l border-dashed"
              style={{
                borderColor: DASH,
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, #000 8%, #000 90%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, #000 8%, #000 90%, transparent 100%)",
              }}
            />

            {STRATA.map((s) => (
              <Stratum key={s.n} s={s} />
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);
