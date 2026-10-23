import controlArea from "@/assets/maps/control-area.png";
import placeboArea from "@/assets/maps/placebo-area.png";
import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "../cn";
import { VideoLoop } from "../video-loop";

/* A dynamic baseline in three steps, each in Pachama's own layers for
 * Manoa: its control area (a ring of matched pixels of forest around the
 * project), the forest loss around it year by year (the layer from its
 * carbon monitoring page, clearing in red), and the control areas of its
 * placebos, scattered where there's no project. Each step's number takes
 * its layer's colour. */
const MEDIA = "relative aspect-[1176/620] overflow-hidden rounded-[10px] bg-[#06100b]";

const Step = ({
  n,
  colour,
  title,
  text,
  media,
  flip = false,
}: {
  n: number;
  /** The layer's colour, with a text colour that reads on it. */
  colour: string;
  title: string;
  text: ReactNode;
  media: ReactNode;
  flip?: boolean;
}) => (
  <li className="grid items-center gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-12">
    <div className={cn("lg:col-span-7", flip && "lg:order-last")}>{media}</div>
    <div data-reveal className="lg:col-span-5">
      <span aria-hidden className={cn("grid size-10 place-items-center rounded-full text-[16px] font-bold", colour)}>
        {n}
      </span>
      <h4 className="mt-5 text-[28px] leading-[1.1] font-bold text-(--tone-head) sm:text-[32px]">{title}</h4>
      <p className="type-body mt-4 max-w-[30rem] text-(--tone-text)">{text}</p>
    </div>
  </li>
);

export const DynamicBaseline = ({ className }: { className?: string }) => (
  <ol className={cn("grid gap-16 sm:gap-24", className)}>
    <Step
      n={1}
      colour="bg-[#f9e63f] text-[#0e2517]"
      title="Find the forest's twin"
      text="Forest outside the project is matched, pixel by pixel, to forest inside it: alike in everything that makes land likely to be cleared. Each yellow dot is a match. Together, they ring Manoa: its control area."
      media={
        <div data-reveal="sweep" className={MEDIA}>
          <Image
            src={controlArea}
            alt="Manoa's control area: a ring of matched pixels of forest, in yellow, around the project"
            fill
            sizes="(min-width: 1024px) 420px, 60vw"
            className="object-contain p-2 sm:p-6"
          />
          <span className="type-label absolute top-1/2 left-1/2 -translate-1/2 rounded-full border border-white/20 bg-black/60 px-2 py-1 text-fog sm:px-3 sm:py-1.5">
            Manoa
          </span>
        </div>
      }
    />
    <Step
      n={2}
      colour="bg-[#ea0202] text-white"
      title="Watch them both, every year"
      text="Satellites then measure both, year after year. What the control area loses is the baseline: what the project would have lost without it. Here, Manoa: clearing in red closes in around it while the forest inside its boundary holds."
      flip
      media={
        <div data-reveal="frame" className={MEDIA}>
          <VideoLoop
            src="/video/baseline-timelapse.mp4"
            poster="/video/baseline-timelapse.jpg"
            label="Manoa by satellite, year by year: clearing, in red, spreads around the project's boundary while the forest inside it stays green"
            className="block size-full object-cover"
          />
        </div>
      }
    />
    <Step
      n={3}
      colour="bg-[#84e1ff] text-[#0e2517]"
      title="Test it where there's no project"
      text="The same matching, run on forest with no project: placebos. Their control areas, the blue patches, should lose what the forest inside them loses. Any gap between them is the method's own error."
      media={
        <div data-reveal="frame" className={MEDIA}>
          <Image
            src={placeboArea}
            alt="Placebos' control areas: thousands of matched pixels of forest, in blue, in patches where there's no project"
            fill
            sizes="(min-width: 1024px) 720px, 100vw"
            className="object-cover"
          />
        </div>
      }
    />
  </ol>
);
