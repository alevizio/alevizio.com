"use client";

import background from "@/assets/page/tour/ask-bg.webp";
import globe from "@/assets/page/tour/ask-disc.webp";
import Image from "next/image";
import { SignupField } from "./signup-field";
import { TurningPlanet, type Treatment } from "./tour-planet";
import { Cta } from "./ui";
import { Wordmark } from "./wordmark";

/* The closing ask and the footer, live in the tour (tour-page.tsx), in
 * the footer's own 1440 by 668 (Footer 10:2132), coming in all at once:
 * the line, the button, the wordmark and the field over the product's
 * globe, which turns. The globe is the file's screenshot of it under the
 * file's treatment, both refitted by scripts/make-tour-layers.py: the
 * background is drawn once, and the shader sets the turning disc in the
 * same treatment, so it turns under the light and not with it. */

// The disc, its centre and radius in the footer's px, and the canvas over
// the part of it the footer shows.
const DISC = [720, 997.8, 549.7] as const;
const BOX = [270, 440, 900, 228] as const;
const FRAME = [1440, 668] as const;
// The treatment's weights, a row a term (1, r, g, b, r², g², b², rg, gb,
// rb, r³, g³, b³, then x, y, x², y², xy, |x| across the frame), a column
// a channel.
const TREAT: Treatment = [
  [0.2616, 0.3701, 0.3116],
  [0.632, -0.1723, -0.4381],
  [0.4239, 1.0078, 0.5476],
  [-1.0494, -1.1768, -0.5426],
  [-3.7956, -5.7325, -5.9434],
  [-0.7048, -0.0952, 0.2553],
  [1.0367, 2.3149, 1.3263],
  [2.313, 4.5711, 4.8826],
  [0.0456, -1.77, -1.2538],
  [0.2623, 0.8978, 1.3294],
  [2.3699, 3.1056, 3.1383],
  [-0.6057, -1.125, -2.0993],
  [-0.3934, -1.0889, -0.4717],
  [-0.0079, -0.0125, -0.0112],
  [0.0782, 0.0902, 0.0625],
  [0.1569, 0.307, 0.2885],
  [-0.0523, -0.0951, -0.0849],
  [0.0102, 0.0126, 0.011],
  [-0.2983, -0.5332, -0.4807],
];

export const TourAsk = ({ on }: { on: boolean }) => (
  <div className="absolute top-0 left-0 h-[668px] w-[1440px]">
    <Image src={background} alt="" sizes="1440px" loading="eager" className="absolute inset-0 size-full" />
    <TurningPlanet src={globe.src} size={0.9934} box={BOX} disc={DISC} tilt={0.42} run={on} treat={TREAT} frame={FRAME} />
    <div className="absolute top-32 left-[214px] w-[1012px] text-center font-sans text-[50px] leading-none tracking-[-1px] text-white">
      Bring Earth Intelligence to life
      <br />
      —start building with Earthscale today.
    </div>
    <Cta className="absolute top-[260px] left-[631px] motion-safe:animate-[es-glow_3.2s_ease-in-out_infinite]" />
    <Wordmark still className="absolute top-[514.5px] left-20 w-[180px] max-w-none" />
    <span className="absolute top-[579px] left-20 font-mono text-[14px] leading-[1.1] text-[#868686] uppercase">Copyright © 2025 Earthscale</span>
    <span className="absolute top-[500px] left-[940px] font-sans text-[20px] leading-[1.4] text-mint">Stay up to date</span>
    <SignupField email="" phase="idle" className="absolute top-[542px] left-[940px] w-[420px] border-mist/12" />
  </div>
);
