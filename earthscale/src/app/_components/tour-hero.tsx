"use client";

import planet from "@/assets/page/tour/planet-disc.webp";
import Image from "next/image";
import type { CSSProperties } from "react";
import { SignupField } from "./signup-field";
import { Words } from "./story";
import { TurningPlanet } from "./tour-planet";
import { Cta } from "./ui";
import { Wordmark } from "./wordmark";

/* The landing page's hero, live, at the file's size for the tour to scale:
 * the nav, the headline, the line under it and the field, over the planet.
 * It arrives the way the case study's own things do (stage-look.css): the
 * nav comes down, the headline rises word by word, the line and the field
 * after it, the planet up out of the dark, turning. The tour moves two
 * layers as it scrolls, data-planet lagging and data-copy leading; this
 * only draws them. Past its foot the planet runs on into the next section. */
export const HERO = { width: 1440, height: 799, overhang: 56 };

// The planet's box, and the disc in it: Globe 10:1878 draws it 1425
// across from (334, 179), so its centre is at 1045.75, 890.9 in the hero.
const BOX = [0, 0, 1110, 681] as const;
const DISC = [715.75, 712.9, 712.4] as const;
// Its picture (planet-disc.webp) is square about the disc, which fills
// 0.9917 of it, so it's drawn this wide.
const SIZE = 0.9917;
const SIDE = (DISC[2] / SIZE) * 2;

const after = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export const TourHero = ({ on, className }: { on: boolean; className?: string }) => (
  <div data-on={on ? "" : undefined} className={className} style={{ width: HERO.width, height: HERO.height + HERO.overhang }}>
    <div className="absolute inset-0 bg-[#0e1313]" />
    {/* The planet, where the file has it, with the glow along its limb. It
        darkens down the hero and is gone at the foot, wherever the scroll
        has moved it to. */}
    <div className="absolute inset-0 [mask-image:linear-gradient(black_480px,transparent_880px)]">
      <div data-planet className="absolute" style={{ left: 330, top: 178, width: 1110, height: 681 }}>
        <div className="tour-planet absolute inset-0">
          <Image
            src={planet}
            alt=""
            sizes="1440px"
            className="absolute max-w-none"
            style={{ left: DISC[0] - SIDE / 2, top: DISC[1] - SIDE / 2, width: SIDE, height: SIDE, clipPath: `circle(${DISC[2]}px)` }}
          />
          <TurningPlanet src={planet.src} size={SIZE} box={BOX} disc={DISC} tilt={0.42} run={on} />
          <div className="absolute -inset-[200px] bg-[radial-gradient(circle_at_915.75px_912.9px,transparent_706px,rgb(86_146_134/0.55)_718px,transparent_852px)]" />
        </div>
      </div>
    </div>
    {/* The sky over the limb, the indigo low on the left, the dark the
        headline sits on, and the fade into the next section. */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_760px_300px_at_1060px_110px,rgb(74_122_110/0.28),transparent)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_1100px_520px_at_450px_820px,rgb(52_40_160/0.4),transparent)]" />
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(5_8_8/0.8),rgb(5_8_8/0.45)_32%,transparent_58%)]" />
    <div className="absolute inset-x-0 bottom-0 h-[120px] bg-[linear-gradient(transparent,#0e1313)]" />

    <div className="tour-nav absolute inset-x-0 top-0 flex h-[90px] items-center border-b border-mist/10 bg-[#111516]/85 px-20 font-sans text-[17px] text-mist">
      <Wordmark className="w-[180px] max-w-none" />
      <span className="ml-auto">Team</span>
      <span className="ml-12">Contact</span>
      <Cta className="ml-12" />
    </div>

    <div data-copy className="absolute inset-x-0 top-0">
      <div className="absolute top-[212px] left-20 font-sans text-[72px] leading-[1.04] text-mist">
        <span data-words className="block">
          <Words>Developer Tools</Words>
        </span>
        <span data-words className="block" style={after(0.14)}>
          <Words>for Earth Intelligence</Words>
        </span>
      </div>
      <div className="tour-rise absolute top-[368px] left-20 font-sans text-[28px] leading-[1.4] tracking-[-0.02em] text-mint" style={after(0.45)}>
        Build next-gen geospatial products with cloud-native tools.
      </div>
      <div className="tour-rise absolute top-[474px] left-[81px] w-[420px]" style={after(0.6)}>
        <SignupField email="" phase="idle" className="border-mist/12" />
      </div>
    </div>
  </div>
);
