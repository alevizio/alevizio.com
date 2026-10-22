/* The brand's three faces, set live in the real fonts, each with the job the
 * brand gives it: Chromatic Condensed for headlines in capitals, Matter for
 * text, Matter Mono for numbers and labels. */
const FACES = [
  {
    name: "Chromatic Condensed Bold",
    foundry: "Colophon",
    sample: "See carbon in action.",
    className: "font-display text-[clamp(2.75rem,6vw,4.5rem)] font-bold uppercase leading-[0.9]",
  },
  {
    name: "Matter",
    foundry: "Displaay",
    sample: "Partner with Pachama to access technology and financing for your reforestation project.",
    className: "font-sans text-xl leading-snug",
  },
  {
    name: "Matter Mono",
    foundry: "Displaay",
    sample: "486,764 tCO₂e removed",
    className: "font-mono text-2xl text-leaf",
  },
];

export const TypeSpecimen = () => (
  <div className="grid content-start gap-10 rounded-[10px] bg-deep p-6 text-fog sm:p-8">
    {FACES.map(({ name, foundry, sample, className }) => (
      <div key={name}>
        <p className="type-label text-haze">
          {name} · {foundry}
        </p>
        <p className={`mt-3 ${className}`}>{sample}</p>
      </div>
    ))}
  </div>
);
