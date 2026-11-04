import type { CSSProperties } from "react";
import { FiMessageSquare } from "react-icons/fi";
import { RxArrowUp, RxCheckCircled, RxCross2, RxDotsVertical } from "react-icons/rx";
import { cn } from "./cn";
import { Avatar, PIN } from "./first-pass-comment";
import { GLASS } from "./first-pass-panels";

/* The catalog section's two panels, live in the tour (tour-page.tsx), in
 * the section's px, as the file draws them (Register new data set 10:2033,
 * Comment 10:2080), working once the tour reaches them (stage-look.css,
 * data-t): a data set registering, its first three steps ticking off and
 * the access check typing out by a turning spinner; and a comment, its pin
 * landing and the thread coming in a message at a time. */

const after = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;
const LABEL = "font-mono text-[10px] leading-none";
const BUTTON = "flex items-center gap-1 rounded-[8px] border border-white/30 px-4 py-2 text-[10px] leading-none text-white";

const STEPS = [
  { name: "URL", colour: "text-white" },
  { name: "Access", colour: "text-mist" },
  { name: "Metadata", colour: "text-mist" },
];
const TICK = 0.75; // when the first step ticks off, then a beat each

const Register = () => (
  <div data-t="lift" className="absolute top-[236px] left-20 w-[608px]" style={after(0.1)}>
    <div className={cn("flex flex-col gap-2 p-4", GLASS)}>
      <div className="flex items-center gap-[10px] border-b border-mist/20 pb-4 text-white">
        <span className="flex-1 font-mono text-[12px] leading-none">Register New Dataset</span>
        <RxCross2 className="size-4" />
      </div>
      <div className="flex items-center gap-2 py-4">
        {STEPS.map(({ name, colour }, i) => (
          <span key={name} className="flex items-center gap-1">
            <span className="relative size-[18px] rounded-full border border-dim">
              <svg data-t="pop" viewBox="0 0 18 18" fill="none" aria-hidden className="absolute -inset-px size-[18px] rounded-full bg-mist" style={after(TICK + i * 0.35)}>
                <path d="M5.15 10.29L7.75 12.44L12.85 5.56" stroke="#7b847d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span data-t="lit" className={cn(LABEL, colour)} style={after(TICK + i * 0.35)}>
              {name}
            </span>
          </span>
        ))}
        <span className="flex items-center gap-1">
          <span className="size-[18px] rounded-full border border-dim" />
          <span className={cn(LABEL, "text-dim")}>Visualization</span>
        </span>
      </div>
      <div className="flex items-center gap-2 py-2">
        <span data-t="type" className={cn(LABEL, "flex-1 text-white")} style={after(TICK + 1.1)}>
          Checking Access To Gs://Earthscale-Public/Datasets/Raster/Hles_tanzania/...
        </span>
        <svg viewBox="0 0 24 24" aria-hidden className="size-6 motion-safe:animate-spin">
          <path d="M24 12A12 12 0 0 0 12 0V2.4A9.6 9.6 0 0 1 21.6 12Z" fill="#efefef" />
        </svg>
      </div>
      <div className="flex justify-between pt-4 font-sans">
        <span className={cn(BUTTON, "opacity-50")}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 rotate-180">
            <path d="M9.33 3.83L13.5 8L9.33 12.17M13 8H2.5" stroke="#ededed" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </span>
        <span className={BUTTON}>
          Try Again
          <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4" stroke="#e6f6e7" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 1.33V5.33H6M14 8A6 6 0 0 0 4 3.53L2 5.33M14 14.67V10.67H10M2 8A6 6 0 0 0 12 12.47L14 10.67" />
          </svg>
        </span>
      </div>
    </div>
  </div>
);

// A message as the file sets it: the name and the note cap high, 16 apart,
// beside the initial, 48 a row.
const CAP = "leading-none [text-box:trim-both_cap_alphabetic]";
const Message = ({ initial, who, when, text }: { initial: string; who: string; when: string; text: string }) => (
  <div className="flex items-start gap-2 py-2">
    <Avatar initial={initial} />
    <span className="flex h-8 flex-col justify-center gap-4 whitespace-nowrap">
      <span className="flex items-end gap-1">
        <span className={cn(CAP, "text-[12px] text-white")}>{who}</span>
        <span className={cn(CAP, "text-[10px] text-mist/50")}>{when}</span>
      </span>
      <span className={cn(CAP, "text-[12px] text-white")}>{text}</span>
    </span>
  </div>
);

const MESSAGES = [
  { initial: "F", who: "Felix Dorrek", when: "8 hrs ago", text: "There’s something weird about this tile" },
  { initial: "N", who: "Noah", when: "2 hrs ago", text: "I’m not 100% what it is but I’ll have a look" },
  { initial: "F", who: "Felix Dorrek", when: "5 min ago", text: "Thanks!" },
];

const Thread = () => (
  <div className="absolute top-[236px] left-[752px] flex w-[608px] items-start gap-4">
    <span data-t="pop" className={cn("grid size-8 shrink-0 origin-bottom-left place-items-center rounded-full rounded-bl-none", PIN)} style={after(0.55)}>
      <FiMessageSquare className="size-4" />
    </span>
    <div data-t="lift" className="flex-1" style={after(0.25)}>
      <div className={cn("flex flex-col gap-2 p-4", GLASS)}>
        <div className="flex items-center gap-[10px] border-b border-mist/20 pb-4 text-white">
          <span className="flex-1 font-mono text-[12px] leading-none">Comment</span>
          <RxDotsVertical className="size-4" />
          <RxCheckCircled className="size-4" />
          <RxCross2 className="size-4" />
        </div>
        {MESSAGES.map((message, i) => (
          <div key={message.when} data-t="rise" style={after(0.8 + i * 0.3)}>
            <Message {...message} />
          </div>
        ))}
        <div data-t="rise" className="flex items-center gap-2 py-2" style={after(1.7)}>
          <Avatar initial="N" />
          <span className="flex flex-1 items-center gap-4 rounded-[38px] border border-mist/20 py-1 pr-1 pl-4">
            <span className="flex-1 text-[12px] leading-none text-white/40">Reply</span>
            <span className={cn("grid size-7 place-items-center rounded-full motion-safe:animate-[es-glow_3.2s_ease-in-out_infinite]", PIN)}>
              <RxArrowUp className="size-3" />
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
);

export const TourCatalog = () => (
  <>
    <Register />
    <Thread />
  </>
);
