import { cn } from "../cn";
import { PAGE } from "../story";
import { BanyanTree } from "./tree";

/* Banyan's chapter opens on its own cover, rebuilt: the name in live type
 * over the cover's point-cloud tree, which grows in when it's reached (see
 * BanyanTree). It's the chapter's title too. */
export const BanyanHero = ({ id, className }: { id: string; className?: string }) => (
  <header id={id} data-scene className={cn("relative isolate h-[min(100svh,58rem)] min-h-[36rem] scroll-mt-10 overflow-hidden", className)}>
    <BanyanTree className="absolute inset-0 -z-10" />
    {/* The words stay clear of the dots: the ground shows through on the left (on a phone, at the top). */}
    <div
      aria-hidden
      className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-bn-eggshell)_15%,rgb(253_251_241/0.7)_42%,transparent_62%)] max-sm:bg-[linear-gradient(to_bottom,var(--color-bn-eggshell)_42%,rgb(253_251_241/0.6)_60%,transparent_76%)]"
    />
    <div className={cn(PAGE, "flex h-full flex-col justify-center max-sm:justify-start max-sm:pt-20")}>
      <p data-reveal className="type-label text-(--tone-label)">
        Chapter III
      </p>
      <h2 data-reveal className="type-display mt-4 text-bn-heavy [--reveal-delay:0.08s]">
        Banyan
      </h2>
      <p data-reveal className="mt-3 text-[clamp(1.5rem,3vw,2.5rem)] leading-none font-medium text-bn-medium [--reveal-delay:0.16s]">
        Design system
      </p>
      <p data-reveal className="type-body mt-8 max-w-[32rem] text-(--tone-text) [--reveal-delay:0.24s]">
        The design system behind Pachama&rsquo;s products. I designed it and documented every component in Figma; Pachama&rsquo;s engineers built the
        same components in code. Rebuilt here from the Figma, and working.
      </p>
    </div>
  </header>
);
