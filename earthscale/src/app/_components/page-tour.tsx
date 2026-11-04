"use client";

import mobile from "@/assets/page/mobile.webp";
import { Phone, Scroll, Stage, Window, type Act } from "@/stageshow/kit";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Laptop } from "./devices";
import { PAGE_H, SECTION_TOPS, TourPage } from "./tour-page";
import "./stage-look.css";

/* The whole landing page, the way a product shot shows it (Stageshow, after
 * its full-width hero): the page in a browser on a laptop's screen, the
 * whole laptop on the stage, working. The hero arrives; then it reads down
 * the page a section at a time, each coming in as it's reached and
 * working while it's read, the planet and the pictures moving slower than
 * the page (tour-page.tsx), to the closing ask; it goes back up and the
 * hero folds away to start again. The
 * page keeps its size throughout. On a phone it is the phone page in an
 * iPhone, read down and back up. */

type S = { on: boolean };
const gone: S = { on: false };
const shown: S = { on: true };

// The browser's view, under its 38 px bar on a 16 by 10 screen.
const VIEW = 650 - 38;
// Where it stops on the way down, and how long it reads there.
const STOPS: [number, number][] = [
  [SECTION_TOPS[0] - 100, 3600], // the proof, under the hero's foot, while its quote changes
  [SECTION_TOPS[1] + 50, 2200], // who it's for, while its cards build
  [SECTION_TOPS[2] + 120, 4800], // serve, its tile source in view too, while it plays
  [SECTION_TOPS[3], 2600], // the explorer, while its map runs
  [SECTION_TOPS[4] - 120, 2400], // the catalog, while its panels work
  [PAGE_H - VIEW, 2000], // the closing ask, at the foot
];

async function wide(a: Act<S>) {
  await a.wait(500);
  await a.set({ on: true });
  await a.wait(2600);
  for (const [to, hold] of STOPS) {
    await a.scroll("page", Math.round(to), { duration: 1200 });
    await a.wait(hold);
  }
  await a.scroll("page", 0, { duration: 1800 });
  await a.wait(1500);
  await a.set({ on: false });
  await a.wait(900);
}

// The phone page is 420 wide in the file; the iPhone's screen is 402.
const NARROW = 402 / 420;
const PHONE_EXPLORE = Math.round(4820 * NARROW);
const PHONE_BOTTOM = Math.round(7574 * NARROW) - 812;

async function narrow(a: Act<S>) {
  await a.wait(1400);
  await a.scroll("page", PHONE_EXPLORE);
  await a.wait(1400);
  await a.scroll("page", PHONE_BOTTOM);
  await a.wait(800);
  await a.scroll("page", 0, { duration: 1100 });
  await a.wait(400);
}

const BrowserTour = () => (
  <Stage<S> width={1200} height={770} theme="dark" fidelity="realistic" initial={gone} poster={shown} script={wide} className="look-earthscale es-tour">
    {(s) => (
      <Laptop className="tour-laptop">
        <Window url="earthscale.ai" urlShape="pill" nav className="tour-window">
          <Scroll name="page" className="tour-page" data-crop>
            <TourPage on={s.on} />
          </Scroll>
        </Window>
      </Laptop>
    )}
  </Stage>
);

const PhoneTour = () => (
  <Stage<S> width={358} height={600} theme="dark" fidelity="realistic" initial={shown} script={narrow} className="look-earthscale es-tour">
    {() => (
      <Phone width={326} dark wallpaper="#0f1313" className="tour-phone">
        <Scroll name="page" bar="none" className="tour-phone-page" data-crop>
          <Image src={mobile} alt="" sizes="420px" className="block h-auto w-full" />
        </Scroll>
      </Phone>
    )}
  </Stage>
);

export const PageTour = ({ caption, className }: { caption?: string; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  // The tour's pictures load as it nears, not with the page.
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        seen.disconnect();
      },
      { rootMargin: "1500px 0px" },
    );
    seen.observe(el);
    return () => seen.disconnect();
  }, []);

  return (
    <figure data-reveal="frame" className={className}>
      <div
        ref={ref}
        role="img"
        aria-label="Earthscale's landing page in a browser on a laptop, working: the hero arrives over its turning planet, its headline rising word by word, then the page scrolls down a section at a time: the quote changes, the who cards build themselves, the serve section plays, its features lit in turn as its call types in and its tile source arrives, the explorer's map runs through its time steps as its panels come in, a data set registers and a comment thread comes in, and the closing ask arrives all at once over the turning globe, and back up"
      >
        <div className="max-sm:hidden">{near ? <BrowserTour /> : <div className="aspect-[1200/770]" />}</div>
        <div className="sm:hidden">{near ? <PhoneTour /> : <div className="mx-auto aspect-[358/600] max-w-[358px]" />}</div>
      </div>
      {caption ? <figcaption className="type-caption mt-3 text-(--tone-text)">{caption}</figcaption> : null}
    </figure>
  );
};
