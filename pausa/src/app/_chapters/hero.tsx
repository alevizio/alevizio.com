import { cn } from "../_components/cn";
import { Cta } from "../_components/cta";
import { Spread } from "../_components/figure";
import { HeroScribble } from "../_components/hero-scribble";
import { Lockup } from "../_components/lockup";
import { OOH } from "../_components/media";
import { PenMark } from "../_components/pen-mark";
import { PAGE } from "../_components/story";
import { tidy } from "../_components/tidy";

export const APP_STORE_URL = "https://apps.apple.com/app/pausa/id6502012412";

const META = [
  { label: "Role", value: "Brand identity + app UI, solo" },
  { label: "Timeline", value: "Jun – Aug 2026, ~9 weeks" },
  { label: "Deliverables", value: "Mark, brand book, App Store, website" },
] as const;

/* The intro, built like the Messa story's (a pill, the mark as the title,
 * one sentence, the buttons, the facts), on pausa.co's paper, with
 * pausa.co's own scribble opening up behind it. */
export const Hero = () => (
  <header className="relative isolate overflow-hidden">
    <div
      aria-hidden
      className="absolute -inset-x-[8vw] -top-8 -z-10 h-[860px] bg-[url(/pausa-co/paper-hero-blur.jpg)] bg-cover bg-center opacity-90 blur-[50px]"
    />
    <HeroScribble className="absolute top-16 -right-[22vw] -z-10 w-[88vw] max-w-[1100px] sm:-right-[12vw] lg:top-6 lg:w-[62vw]" />

    <div className={cn(PAGE, "pt-16 sm:pt-28")}>
      <p className="type-label inline-flex items-center rounded-full border border-rule bg-sheet/80 px-3 py-1 text-pen">
        Case study · Shipped
      </p>
      <h1 className="mt-8">
        <Lockup className="h-16 sm:h-20" />
      </h1>
      <p className="mt-8 max-w-[36rem] font-serif text-[length:clamp(1.125rem,1.55vw,1.375rem)] leading-[1.6] text-body">
        A journal that <PenMark>pushes back</PenMark>{" "}
        needed a brand with the nerve to match. I&nbsp;drew it by hand: a&nbsp;knot for a mark, one blue pen, and
        a&nbsp;highlighter it uses once per screen.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Cta href="https://www.pausa.co/" icon="arrow">
          Visit the live site
        </Cta>
        <Cta href={APP_STORE_URL} icon="apple" variant="outline">
          See the app on the App&nbsp;Store
        </Cta>
      </div>
      <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-rule pt-8 sm:grid-cols-4">
        {META.map((item) => (
          <div key={item.label}>
            <dt className="type-label text-body">{item.label}</dt>
            <dd className="mt-2 font-sans text-[0.95rem] leading-[1.5] text-ink">{tidy(item.value)}</dd>
          </div>
        ))}
        <div>
          <dt className="type-label text-body">Client</dt>
          <dd className="mt-2 font-sans text-[0.95rem] leading-[1.5] text-ink">
            Pausa
            <span className="mt-1 block text-body">pausa.co</span>
          </dd>
        </div>
      </dl>
    </div>

    <Spread shot={OOH.billboard} priority />
  </header>
);
