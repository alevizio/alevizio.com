import { ProductSection } from "./messa-product/product-section";
import { SurveyGrid } from "./underneath-strata";

/**
 * The Messa product, split to match the case study's structure:
 *
 *  - <LiveProduct/> — the real, interactive product section and the
 *    "underneath" dig, ported straight from messa-landing (see
 *    ./messa-product), full-bleed. Lives in the Website chapter: the
 *    reader clicks the tabs and digs the ground, not a screenshot.
 *
 *  - <ProductCommits/> — one feature's evolution as a timelapse and the
 *    commit "iceberg" (what 759 commits actually did). Lives in the
 *    Underneath chapter, with the deploy scrubber and the timelapse film.
 *
 * Both run in the brand's own fonts + the cream-landing slate accent,
 * scoped to .messa-embed (see globals.css) so the rest of the page is
 * untouched.
 */
type Stat = { value: string; label: string };
const COMMIT_STATS: readonly Stat[] = [
  { value: "759", label: "commits, Mar → Jun" },
  { value: "385", label: "fixes" },
  { value: "202", label: "features" },
  { value: "24", label: "perf passes" },
];
const SURFACE_COMMITS: readonly Stat[] = [
  { value: "189", label: "the factory conveyor" },
  { value: "97", label: "the hero" },
  { value: "65", label: "the demo modal" },
  { value: "59", label: "the product mockup" },
  { value: "48", label: "how-it-works" },
];

/** The live, interactive product + the "underneath" dig — the actual
 * components, full-bleed; fonts + slate accent scoped to .messa-embed. The
 * bottom fades out so the product sinks into the ground below it instead of
 * being cut by a hard horizontal edge where the underneath section overlaps. */
export const LiveProduct = ({ className }: { className?: string }) => (
  <div
    className={`messa-embed mx-[calc(50%-50vw)] bg-[#FBF0E6] ${className ?? ""}`}
    style={{
      maskImage:
        "linear-gradient(to bottom, #000 calc(100% - 320px), transparent calc(100% - 140px))",
      WebkitMaskImage:
        "linear-gradient(to bottom, #000 calc(100% - 320px), transparent calc(100% - 140px))",
    }}
  >
    <ProductSection transparent />
  </div>
);

/** The commit "iceberg" + one feature's evolution as a timelapse. */
export const ProductCommits = ({ className }: { className?: string }) => (
  <section className={className}>
    {/* The iceberg — what the commits did, in real numbers. */}
    <div className="mx-auto max-w-5xl px-6">
      <h3 className="story-serif text-xl tracking-tight text-[#0A0A0B]">
        What 759 commits actually did
      </h3>
      <p className="mt-3 max-w-xl text-base leading-7 text-[#6E6B68]">
        The screenshots stopped changing long before the work did. The shape of
        those commits:
      </p>
      <SurveyGrid
        items={COMMIT_STATS}
        columns="grid-cols-2 sm:grid-cols-4"
        className="mt-6"
      />
      <p className="mt-8 text-base leading-7 text-[#6E6B68]">
        And where they landed — the busiest surfaces, by commits that touched
        them:
      </p>
      <SurveyGrid
        items={SURFACE_COMMITS}
        columns="grid-cols-2 sm:grid-cols-5"
        className="mt-6"
      />
    </div>
  </section>
);
