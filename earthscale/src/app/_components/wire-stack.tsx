"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

import ask from "@/assets/process/wire/08-ask.webp";
import deploy from "@/assets/process/wire/05-deploy.webp";
import explore from "@/assets/process/wire/07-explore.webp";
import footer from "@/assets/process/wire/09-footer.webp";
import hero from "@/assets/process/wire/02-hero.webp";
import logos from "@/assets/process/wire/03-logos.webp";
import nav from "@/assets/process/wire/01-nav.webp";
import test from "@/assets/process/wire/06-test.webp";
import who from "@/assets/process/wire/04-who.webp";
import { cn } from "./cn";

/* The desktop wireframe, taken apart: its nine blocks as sheets in a
 * stack, each tipping into place as it scrolls in, with a numbered index
 * beside them that follows the scroll and jumps to a block on click. On
 * phones the index folds into a label over each sheet. */
type Block = { id: string; name: string; note: string; src: StaticImageData; alt: string };

const BLOCKS: Block[] = [
  { id: "nav", name: "Nav", note: "The logo, two links and one button.", src: nav, alt: "The nav bar: logo, Team, Contact and a Get Started button" },
  {
    id: "hero",
    name: "Hero",
    note: "The headline, an email field and the product behind it, cut by the fold.",
    src: hero,
    alt: "The hero: a three-line headline, a line under it, an email field with Get Started, a video demo button, and a product window of grey boxes",
  },
  { id: "logos", name: "Logos", note: "A row for logos, as the brief asked.", src: logos, alt: "A line about the platforms on Earthscale, then the Pachama, Linear and Vercel marks" },
  { id: "who", name: "Who it’s for", note: "Two cards, teams and businesses.", src: who, alt: "Made for modern eng teams: two cards, for teams and for businesses" },
  { id: "deploy", name: "Deploy", note: "Three features in a row, numbered.", src: deploy, alt: "Deploy Geospatial Data at Scale, Instantly: three numbered feature cards" },
  { id: "test", name: "Test", note: "One wide card for the pixel and time series tools.", src: test, alt: "Test, QA, and Explore Your Geospatial Data with Ease: one wide card with a picture box" },
  { id: "explore", name: "Explore", note: "Registration and QA, side by side.", src: explore, alt: "Two cards: Instant Dataset Registration and Visualization, and Collaborative QA with Maps and Comments" },
  { id: "ask", name: "The ask", note: "One line and the two buttons again.", src: ask, alt: "Bring your geospatial data to life, start building with Earthscale today, with Get Started and video demo buttons" },
  { id: "footer", name: "Footer", note: "The logo, the copyright and the email field once more.", src: footer, alt: "The footer: logo, copyright, and a Stay up to date email field" },
];

/* The sheets on screen at the start arrive one after another. */
const WAVE = ["[--reveal-delay:0s]", "[--reveal-delay:0.12s]", "[--reveal-delay:0.24s]"];

const SIZES = "(min-width: 1376px) 756px, (min-width: 1024px) 58vw, 100vw";

const number = (i: number) => String(i + 1).padStart(2, "0");

export const WireStack = ({ className }: { className?: string }) => {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const sheets = useRef<(HTMLElement | null)[]>([]);

  // The block nearest the upper half of the window is the one lit in the
  // index; only measured while the stack is on screen.
  useEffect(() => {
    let frame = 0;
    const pick = () => {
      frame = 0;
      const line = window.innerHeight * 0.42;
      let best = 0;
      let nearest = Infinity;
      sheets.current.forEach((el, i) => {
        if (!el) return;
        const { top, bottom } = el.getBoundingClientRect();
        const away = top > line ? top - line : bottom < line ? line - bottom : 0;
        if (away < nearest) {
          nearest = away;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(pick);
    };
    const watch = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
      } else window.removeEventListener("scroll", onScroll);
    });
    if (root.current) watch.observe(root.current);
    return () => {
      watch.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const jump = (i: number) => sheets.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <div ref={root} className={cn("lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-12 xl:gap-x-20", className)}>
      <ol data-reveal className="hidden self-start border-b border-(--tone-line) lg:sticky lg:top-24 lg:block [--reveal-delay:0.1s]">
        {BLOCKS.map(({ id, name, note }, i) => {
          const on = active === i;
          return (
            <li key={id} className="border-t border-(--tone-line)">
              <button
                type="button"
                onClick={() => jump(i)}
                aria-current={on ? "true" : undefined}
                className={cn("flex w-full cursor-pointer gap-5 py-3.5 text-left transition-colors duration-500", on ? "text-(--tone-head)" : "text-(--tone-text) hover:text-(--tone-head)")}
              >
                <span className={cn("type-label pt-1.5 transition-colors duration-500", on ? "text-(--tone-label)" : "text-(--tone-text)")}>{number(i)}</span>
                <span className="min-w-0 flex-1">
                  <span className="type-body block">{name}</span>
                  <span className={cn("grid transition-[grid-template-rows] duration-500 ease-out", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                    <span className="min-h-0 overflow-hidden">
                      <span className={cn("type-caption block pt-1 pb-1 text-(--tone-text) transition-opacity duration-500", on ? "opacity-100" : "opacity-0")}>{note}</span>
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-col gap-5 sm:gap-6">
        {BLOCKS.map(({ id, name, note, src, alt }, i) => (
          <figure
            key={id}
            ref={(el) => {
              sheets.current[i] = el;
            }}
            data-reveal="lay"
            className={WAVE[Math.min(i, WAVE.length - 1)]}
          >
            <figcaption className="mb-2 flex items-baseline gap-3 lg:hidden">
              <span className="type-label text-(--tone-label)">{number(i)}</span>
              <span className="type-caption text-(--tone-head)">{name}</span>
            </figcaption>
            <div className={cn("overflow-hidden rounded-[8px] ring-1 transition-shadow duration-700", active === i ? "ring-mint/50" : "ring-(--tone-line)")}>
              <Image src={src} alt={alt} sizes={SIZES} placeholder="blur" className="h-auto w-full" />
            </div>
            <p className="type-caption mt-2 text-(--tone-text) lg:hidden">{note}</p>
          </figure>
        ))}
      </div>
    </div>
  );
};
