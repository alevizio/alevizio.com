import { cn } from "../_components/cn";
import { Cta } from "../_components/cta";
import { Lockup } from "../_components/lockup";
import { Hand, PAGE } from "../_components/story";
import { APP_STORE_URL } from "./hero";

/* The sign-off, set like the brand book's cover: the one surface where the
 * blue gets the whole page, under the same wrinkled paper at full strength,
 * so it reads as deep as the book's. It sits straight on the last street
 * photo, with no paper between them. */
export const Closing = () => (
  <footer className="relative isolate overflow-hidden bg-pen bg-[url(/pausa-co/paper-texture-deep.jpg)] bg-size-[100%_auto] bg-blend-multiply text-cream">
    {/* eslint-disable-next-line @next/next/no-img-element -- decorative watermark */}
    <img
      aria-hidden
      alt=""
      src="/pausa-co/mark-mid-swirl.svg"
      className="pointer-events-none absolute -right-24 -bottom-40 -z-10 w-[640px] max-w-none opacity-[0.12] brightness-0 invert sm:w-[860px]"
    />
    <div className={cn(PAGE, "py-24 sm:py-32")}>
      <Lockup onDark className="h-12" />
      {/* the display style, a step smaller at phone widths so "The journal that" holds one line */}
      <p className="mt-10 max-w-[12em] font-serif text-[length:clamp(2.25rem,5.9vw+1rem,5.25rem)] leading-[1.04] font-medium tracking-[-0.02em] text-balance">
        The journal that pushes&nbsp;back.
      </p>
      <Hand onDark className="mt-6">handed over on 25 August: the book, and 255 files to build with.</Hand>
      <div className="mt-12 flex flex-wrap gap-4">
        <Cta href="https://www.pausa.co/" icon="arrow" variant="inverse">
          Visit the live site
        </Cta>
        <Cta href={APP_STORE_URL} icon="apple" variant="ghost">
          See the app on the App&nbsp;Store
        </Cta>
      </div>
      <p className="type-label mt-20 text-cream/60">Brand identity, app UI and site design by Alejandro Vizio · 2026</p>
    </div>
  </footer>
);
