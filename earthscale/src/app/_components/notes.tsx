import { cn } from "./cn";

/* The brief, as it came: notes Earthscale left in the Figma, word for word.
 * The line about who the product is for and the section they wanted room
 * for, then the two lists of features, one for what the page should show
 * and one for what a developer gets. */
const NOTES: { title?: string; lines: string[] }[] = [
  {
    lines: ["Earthscale is built for product, data, and engineering teams working with Earth observation and remote sensing data."],
  },
  {
    lines: [
      "We’d need a section for customer logos and/or testimonials. We might not launch with it right away but would like to have something in place where we can simply drop in the content when ready.",
    ],
  },
  {
    title: "Key features",
    lines: [
      "Register and visualize any geospatial dataset in seconds",
      "On-the fly serving for immediate cost-effective visualization",
      "Optimized datasets for high-performance and large scale overviews",
      "Discover relevant data assets through an organization wide data catalog",
      "Spatial filtering",
      "Search by name",
      "Organize datasets into maps",
      "Leave geo-tagged comments to flag issues",
      "Fetch band and time-series values for any given pixel",
      "Organize maps into projects (coming soon)",
      "Compute zonal statistics (coming soon)",
      "Python client & API",
      "Registering datasets",
      "Creating maps (coming soon)",
    ],
  },
  {
    title: "Key features, for developers",
    lines: [
      "Register and style geospatial dataset and receive x/y/z tile-server urls compatible with any major frontend mapping framework (e.g. Mapbox GL)",
      "On-the fly serving for immediate cost-effective visualization",
      "Optimized datasets for high-performance and large scale overviews",
      "Available through python client, API or Earthscale’s user interface",
      "Request pixel level time-series and band information via API or python client to use in your own application for serving to end users",
    ],
  },
];

export const Notes = ({ className }: { className?: string }) => (
  <div data-stagger className={cn("grid gap-4 sm:grid-cols-2 sm:gap-6", className)}>
    {NOTES.map(({ title, lines }, i) => (
      <div key={i} data-reveal className="hairline flex flex-col rounded-[10px] bg-(--tone-fill) p-6">
        <p className="type-label text-(--tone-label)">Earthscale, in the file</p>
        {title ? <p className="type-caption mt-5 text-(--tone-head)">{title}</p> : null}
        <ul className={cn("type-caption text-(--tone-text)", title ? "mt-2" : "mt-5", lines.length > 1 && "list-disc space-y-1.5 pl-4")}>
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);
