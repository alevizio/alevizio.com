"use client";

import desktop from "@/assets/page/desktop.webp";
import mobile from "@/assets/page/mobile.webp";
import { Camera, Phone, Scroll, Stage, Window, type Act, type Rect } from "@/stageshow/kit";
import Image from "next/image";
import { SignupField, type SignupPhase } from "./signup-field";
import { useMounted } from "./use-mounted";
import "./stage-look.css";

/* The whole landing page, the way a product shot shows it (Stageshow, after
 * its full-width hero): the page from the file in a browser, inset from the
 * top and running off the bottom. Someone signs up in the hero, the field
 * going through the states the file draws for it; then they read down, the
 * camera pushing in on the explorer's layers panel, too small to read at
 * this size, and on to the closing ask, and scroll back up. On a phone it is
 * the phone page in an iPhone, told the same way with a finger. The field
 * is live over the picture of the page; the rest is the file. */

type S = { focus: boolean; email: string; phase: SignupPhase; zoom: Rect | null };

const EMAIL = "maya@geolab.io";
const initial: S = { focus: false, email: "", phase: "idle", zoom: null };
// The still: signed up, the hero whole.
const poster: S = { focus: false, email: EMAIL, phase: "added", zoom: null };

// The page is 1440 by 5393 in the file; the browser shows it 1040 wide.
const WIDE = 1040 / 1440;
// The hero's field in the file, and the explorer's layers panel.
const FIELD = { x: 81, y: 474, w: 420, h: 63 };
const LAYERS = { x: 35, y: 3530, w: 292, h: 444 };
// Scroll offsets at the browser's scale: the explorer's panels in view, and
// the foot of the page, with the closing ask.
const EXPLORE = Math.round(3380 * WIDE);
const BOTTOM = Math.round(5393 * WIDE) - 722;

// The phone page is 420 wide in the file; the iPhone's screen is 402.
const NARROW = 402 / 420;
const PHONE_FIELD = { x: 32, y: 573, w: 357, h: 63 };
const PHONE_EXPLORE = Math.round(4820 * NARROW);
const PHONE_BOTTOM = Math.round(7574 * NARROW) - 812;
const PHONE_REST = { x: 300, y: 330 };

// The camera's push in and back out; it holds a beat at the layers panel.
const CAMERA = 900;

// How both scenes open: into the field, the email typed.
async function typeEmail(a: Act<S>) {
  await a.wait(600);
  a.mark("type");
  await a.click({ at: "field", x: 0.3, y: 0.55 });
  await a.set({ focus: true });
  await a.type("email", EMAIL, { interval: 55 });
  await a.wait(300);
  a.mark("send");
}

// How both end: on to the foot of the page and back up. The hero is off
// screen first, so the field empties where no one sees it.
async function readToTheAsk(a: Act<S>, bottom: number) {
  a.mark("ask");
  await a.snap({ email: "", phase: "idle" });
  await a.scroll("page", bottom);
  await a.wait(800);
  await a.scroll("page", 0, { duration: 1100 });
}

async function wide(a: Act<S>) {
  await typeEmail(a);
  await a.click({ at: "cta", x: 0.84, y: 0.62 });
  await a.set({ phase: "adding" });
  await a.wait(800);
  await a.set({ phase: "added", focus: false });
  await a.move({ x: 860, y: 300 });
  await a.wait(1000);
  a.mark("explore");
  await a.scroll("page", EXPLORE);
  await a.wait(200);
  await a.set({ zoom: a.rect("layers") });
  await a.wait(CAMERA + 600);
  await a.set({ zoom: null });
  await a.wait(CAMERA - 100);
  await readToTheAsk(a, BOTTOM);
  await a.wait(400);
}

async function narrow(a: Act<S>) {
  await typeEmail(a);
  await a.click({ at: "cta", x: 0.8, y: 0.6 });
  // The finger lifts: nothing stays under it.
  await a.move(PHONE_REST);
  await a.set({ phase: "adding" });
  await a.wait(800);
  await a.set({ phase: "added", focus: false });
  await a.wait(1000);
  a.mark("explore");
  await a.scroll("page", PHONE_EXPLORE);
  await a.wait(1400);
  await readToTheAsk(a, PHONE_BOTTOM);
  await a.move(PHONE_REST);
  await a.wait(400);
}

/** The hero's field, live over the picture of it, drawn at the file's size
 *  and scaled to the page's, filled solid so the picture's own field
 *  doesn't show through. */
const HeroField = ({ s, box, scale, small = false }: { s: S; box: typeof FIELD; scale: number; small?: boolean }) => (
  <div data-target="field" data-cursor="ibeam" className="absolute" style={{ left: box.x * scale, top: box.y * scale, width: box.w * scale, height: box.h * scale }}>
    <div className="origin-top-left will-change-transform" style={{ width: box.w, transform: `scale(${scale})` }}>
      <SignupField email={s.email} phase={s.phase} focus={s.focus} small={small} className="bg-[#1c2726] shadow-none backdrop-blur-none" />
    </div>
  </div>
);

const BrowserTour = () => (
  <Stage<S> width={1200} height={700} theme="dark" fidelity="realistic" initial={initial} poster={poster} script={wide} cursor={{ at: { x: 860, y: 300 }, style: "real" }} className="look-earthscale es-tour">
    {(s) => (
      <Camera focus={s.zoom} max={1.8} duration={CAMERA}>
        <Window url="earthscale.ai" urlShape="pill" nav className="tour-window">
          <Scroll name="page" className="tour-page" data-crop>
            <div className="relative" style={{ height: Math.round(5393 * WIDE) }}>
              <Image src={desktop} alt="" sizes="1100px" className="block h-auto w-full" />
              <HeroField s={s} box={FIELD} scale={WIDE} />
              <span data-target="layers" className="absolute" style={{ left: LAYERS.x * WIDE, top: LAYERS.y * WIDE, width: LAYERS.w * WIDE, height: LAYERS.h * WIDE }} />
            </div>
          </Scroll>
        </Window>
      </Camera>
    )}
  </Stage>
);

const PhoneTour = () => (
  <Stage<S> width={358} height={600} theme="dark" fidelity="realistic" initial={initial} poster={poster} script={narrow} cursor={{ at: PHONE_REST, style: "touch" }} className="look-earthscale es-tour">
    {(s) => (
      <Phone width={326} dark wallpaper="#0f1313" className="tour-phone">
        <Scroll name="page" bar="none" className="tour-phone-page" data-crop>
          <div className="relative" style={{ height: Math.round(7574 * NARROW) }}>
            <Image src={mobile} alt="" sizes="420px" className="block h-auto w-full" />
            <HeroField s={s} box={PHONE_FIELD} scale={NARROW} small />
          </div>
        </Scroll>
      </Phone>
    )}
  </Stage>
);

export const PageTour = ({ caption, className }: { caption?: string; className?: string }) => {
  const mounted = useMounted();
  return (
    <figure data-reveal="frame" className={className}>
      <div
        role="img"
        aria-label="Earthscale's landing page in a browser: someone types an email into the hero's field and presses Get Started, the field confirms it, then the page scrolls down to the visual explorer, its layers panel comes up close, and on to the closing ask"
      >
        <div className="max-sm:hidden">{mounted ? <BrowserTour /> : <div className="aspect-[1200/700]" />}</div>
        <div className="sm:hidden">{mounted ? <PhoneTour /> : <div className="mx-auto aspect-[358/600] max-w-[358px]" />}</div>
      </div>
      {caption ? <figcaption className="type-caption mt-3 text-(--tone-text)">{caption}</figcaption> : null}
    </figure>
  );
};
