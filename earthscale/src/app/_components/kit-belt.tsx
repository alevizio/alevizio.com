"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { FiDatabase, FiEye, FiEyeOff, FiMessageSquare } from "react-icons/fi";
import { MdAdd } from "react-icons/md";
import { RxArrowUp } from "react-icons/rx";
import { ButtonStates, EmailLoop, Wordmark } from "./anat-hero";
import { LogosRow, Quote } from "./anat-proof";
import { TagRoll } from "./anat-who";
import { cn } from "./cn";
import { EditPanel } from "./edit-panel";
import { IconGrid, RampPicker } from "./kit-pieces";
import { LayersPanel } from "./layers-panel";
import { Button, Select, Slider } from "./panel";
import { Pipeline } from "./pipeline";
import { PixelPanel } from "./pixel-panel";
import { CHIPS } from "./ramps";
import { Register } from "./register";
import { BLEED } from "./shot";
import { SubMenu } from "./sub-menu";
import { Thread } from "./thread";
import { Cta, PageTag } from "./ui";
import { LoopClock } from "./use-loop";

/* The kit on one belt, the way the Pachama story shows its design system:
 * the file's components, built and working, packed in columns about as
 * tall as each other and passing slowly, so the variety shows without a
 * long page. Each one plays itself on the page's clock (LoopClock), so the
 * copy that closes the loop matches the one it takes over from. Under it,
 * the small parts on two rows passing each other. The belt keeps moving
 * under the pointer; with less motion it stands still and scrolls, its
 * pieces at rest. */
type Column = { name: string; width: string; pieces: ReactNode[] };

const COLUMNS: Column[] = [
  { name: "Layers and the button", width: "w-[17.5rem]", pieces: [<LayersPanel key="l" />, <ButtonStates key="b" />] },
  { name: "Field and comment", width: "w-[26rem]", pieces: [<EmailLoop key="e" />, <Thread key="t" />] },
  { name: "Editing, tags and the wordmark", width: "w-[17.5rem]", pieces: [<EditPanel key="e" />, <TagRoll key="t" />, <Wordmark key="w" className="mx-auto max-w-[12rem]" />] },
  { name: "Pipeline", width: "w-[26rem]", pieces: [<Pipeline key="p" />] },
  { name: "Menu and ramps", width: "w-[17.5rem]", pieces: [<SubMenu key="s" />, <RampPicker key="r" />] },
  { name: "Quote and logos", width: "w-[30rem]", pieces: [<Quote key="q" />, <LogosRow key="l" />] },
  { name: "Pixel information", width: "w-[17.5rem]", pieces: [<PixelPanel key="p" />] },
  { name: "Registering and the field's error", width: "w-[26rem]", pieces: [<Register key="r" />, <EmailLoop key="e" ends="error" />] },
  { name: "Icons", width: "w-[19rem]", pieces: [<IconGrid key="i" />] },
];

const Copy = ({ inert = false }: { inert?: boolean }) => (
  <ul aria-hidden={inert || undefined} inert={inert} className="flex shrink-0 items-center gap-12 pr-12">
    {COLUMNS.map((column) => (
      <li key={column.name} className={cn("grid shrink-0 content-start gap-10", column.width)}>
        {column.pieces}
      </li>
    ))}
  </ul>
);

// The small parts, as pictures: the button's states, the tags, a data
// set's chip, the comment's pin, avatars and send button, the panels'
// controls and the pipeline's database.
const Chip = ({ n, name }: { n: number; name: string }) => (
  <span className="flex items-center gap-2 rounded-full border border-rule py-1.5 pr-3.5 pl-1.5 font-sans text-[12px] text-mist">
    <span className={cn("size-6 rounded-[5px]", CHIPS[n])} />
    {name}
  </span>
);
const Avatar = ({ initial }: { initial: string }) => (
  <span className={cn("grid size-8 place-items-center rounded-full text-[13px] font-extrabold", initial === "N" ? "bg-mint text-night" : "border border-rule bg-night text-mist")}>{initial}</span>
);
const Round = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className={cn("grid size-9 place-items-center rounded-full", className)}>{children}</span>
);

const UPPER: ReactNode[] = [
  <Cta key="cta" />,
  <PageTag key="who">Who</PageTag>,
  <Chip key="wind" n={0} name="Weather Forecast" />,
  <Round key="pin" className="rounded-bl-none bg-[#60ff75] text-night">
    <FiMessageSquare className="size-4" />
  </Round>,
  <PageTag key="teams">For teams</PageTag>,
  <Cta key="hover" state="hover" />,
  <Avatar key="f" initial="F" />,
  <span key="db" className="flex items-center gap-2 rounded-[8px] border border-rule bg-card px-3 py-2 font-mono text-[11px] text-mist">
    <FiDatabase className="size-4 text-mint" /> Database
  </span>,
  <PageTag key="production">Production</PageTag>,
  <Button key="add">
    Add new data set <MdAdd className="size-3.5" />
  </Button>,
  <Round key="eye" className="border border-rule text-mist">
    <FiEye className="size-4" />
  </Round>,
];
const LOWER: ReactNode[] = [
  <Round key="send" className="bg-[#60ff75] text-night">
    <RxArrowUp className="size-4" />
  </Round>,
  <PageTag key="development">Development</PageTag>,
  <Select key="band" className="w-40">
    Single Band
  </Select>,
  <Cta key="disabled" state="disabled" />,
  <Avatar key="n" initial="N" />,
  <PageTag key="orgs">For organizations</PageTag>,
  <Chip key="ndvi" n={1} name="Sentinel-2 NDVI" />,
  <Slider key="slider" value={62} className="w-32" />,
  <Cta key="pressed" state="pressed" />,
  <Round key="off" className="border border-rule text-haze">
    <FiEyeOff className="size-4" />
  </Round>,
  <Chip key="canopy" n={4} name="Canopy Height" />,
];

// Two copies side by side, each with its gap after it, so half the width
// is exactly one copy and the loop has no seam.
const Belt = ({ items, reverse = false }: { items: ReactNode[]; reverse?: boolean }) => (
  <div className={cn("flex w-max motion-safe:animate-[belt_70s_linear_infinite]", reverse && "[animation-direction:reverse]")}>
    {[0, 1].map((copy) => (
      <div key={copy} className="flex shrink-0 items-center gap-5 pr-5">
        {items}
      </div>
    ))}
  </div>
);

export const KitBelt = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const clock = useMemo(() => ({ playing }), [playing]);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sight = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting));
    sight.observe(el);
    return () => sight.disconnect();
  }, []);

  return (
    <div className={cn(BLEED, "grid gap-10 sm:gap-12", className)}>
      <LoopClock.Provider value={clock}>
        {/* About 20 px a second, as in the Pachama story; no blur behind the panels while they move. */}
        <div ref={ref} role="region" aria-label="The kit's components, working" className="no-scrollbar overflow-hidden motion-reduce:overflow-x-auto **:backdrop-blur-none">
          <div className="flex w-max motion-safe:animate-[belt_180s_linear_infinite]">
            <Copy />
            <Copy inert />
          </div>
        </div>
      </LoopClock.Provider>
      <figure className="min-w-0">
        <figcaption className="sr-only">The page&rsquo;s buttons, tags, chips, avatars and controls, passing on two rows.</figcaption>
        <div aria-hidden inert className="grid gap-5 overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
          <Belt items={UPPER} />
          <Belt items={LOWER} reverse />
        </div>
      </figure>
    </div>
  );
};
