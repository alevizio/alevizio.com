import { cn } from "./cn";

export type Chapter = { href: string; numeral: string; label: string };

/* A slim bar that stays put: the way back to the portfolio on the left,
 * the four chapters on the right (hidden on phones, where the page is
 * read straight down). */
export const StoryNav = ({
  chapters,
  className,
}: {
  chapters: readonly Chapter[];
  className?: string;
}) => (
  <nav
    aria-label="Case study"
    className={cn(
      "sticky top-0 z-40 border-b border-rule/80 bg-paper/85 backdrop-blur-md",
      className,
    )}
  >
    <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-6">
      <a
        href="https://alevizio.com"
        className="font-sans text-[0.85rem] text-body transition-colors hover:text-ink focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pen"
      >
        <span aria-hidden>← </span>Alejandro Vizio
      </a>
      <ol className="hidden items-center gap-6 md:flex">
        {chapters.map((c) => (
          <li key={c.href}>
            <a
              href={c.href}
              className="group flex items-baseline gap-2 font-sans text-[0.85rem] text-body transition-colors hover:text-ink focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pen"
            >
              <span className="font-mono text-[10px] tracking-[0.18em] text-pen">{c.numeral}</span>
              {c.label}
            </a>
          </li>
        ))}
      </ol>
    </div>
  </nav>
);
