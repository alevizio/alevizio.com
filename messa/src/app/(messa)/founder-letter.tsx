"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

/**
 * The About-page founder letter, rebuilt natively (client direction
 * 2026-06-16/17) — the whole typing machine: a cream paper letter that feeds
 * out of the actual typewriter (the About page's /images/type.webp), letter
 * behind (z-10), typewriter in front (z-30) overlapping the paper's bottom so
 * the page appears to roll out of the platen — exactly the About-page
 * composition. The letter is condensed from the live one so the typewriter and
 * the whole letter fit in a single viewport. Geist Mono, ink-blue caret,
 * PER_CHAR_MS 18 — the About page's exact typing. It starts when it scrolls
 * into view (it sits far down the case study); reduced motion shows it
 * finished. A visibility-hidden remainder reserves each line's height so
 * nothing below shifts as it types.
 */
type LetterLineType = "greeting" | "body" | "closing" | "signature" | "title";
type LetterLine = { text: string; type: LetterLineType; prefilled?: boolean };

const LETTER_LINES: readonly LetterLine[] = [
  { type: "greeting", text: "To people who take hiring seriously,", prefilled: true },
  {
    type: "body",
    prefilled: true,
    text: "I’ve made hires I regretted, and passed on people I should have called back — on a good feeling more than I’d like to admit.",
  },
  { type: "body", text: "A wrong hire is one of the most expensive mistakes a company makes. Good hiring isn’t instinct — it’s a system." },
  { type: "body", text: "That’s what Messa is for. We don’t make the call — we help you see talent clearly." },
  { type: "closing", text: "Yours," },
  { type: "signature", text: "Diego Meller" },
  { type: "title", text: "Founder & CEO, Messa" },
];

const FIRST_ANIMATED_IDX = LETTER_LINES.findIndex((l) => !l.prefilled);
const PER_CHAR_MS = 18; // ~55 chars/sec — the About page's exact speed.
const LETTER_PAUSE: Record<LetterLineType, number> = {
  greeting: 280,
  body: 220,
  closing: 260,
  signature: 280,
  title: 200,
};

const FounderLetter = ({ className }: { className?: string }) => {
  const [progress, setProgress] = useState({ line: FIRST_ANIMATED_IDX, char: 0, done: false });
  const [started, setStarted] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start on scroll-in (once); reduced motion jumps to the finished letter.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (reducedMotion) {
      setProgress({ line: LETTER_LINES.length - 1, char: 0, done: true });
      return;
    }
    let lineIdx = FIRST_ANIMATED_IDX;
    let charIdx = 0;
    const tick = () => {
      const line = LETTER_LINES[lineIdx];
      if (!line) {
        setProgress({ line: LETTER_LINES.length - 1, char: 0, done: true });
        return;
      }
      if (charIdx >= line.text.length) {
        timerRef.current = setTimeout(() => {
          lineIdx += 1;
          charIdx = 0;
          if (lineIdx >= LETTER_LINES.length) {
            setProgress({ line: LETTER_LINES.length - 1, char: 0, done: true });
            return;
          }
          setProgress({ line: lineIdx, char: 0, done: false });
          tick();
        }, LETTER_PAUSE[line.type]);
        return;
      }
      charIdx += 1;
      setProgress({ line: lineIdx, char: charIdx, done: false });
      timerRef.current = setTimeout(tick, PER_CHAR_MS);
    };
    timerRef.current = setTimeout(tick, 200);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [started, reducedMotion]);

  return (
    <div
      ref={ref}
      className={`relative space-y-4 font-mono text-[14px] leading-[1.7] text-[#0A0A0B] md:space-y-5 md:text-[15px] ${className ?? ""}`}
    >
      {LETTER_LINES.map((line, i) => {
        const isPrefilled = !!line.prefilled;
        const isCurrent = !progress.done && !isPrefilled && i === progress.line;
        const isPast = progress.done || (i < progress.line && !isPrefilled);
        let visible: string;
        if (isPrefilled || isPast) visible = line.text;
        else if (isCurrent) visible = line.text.slice(0, progress.char);
        else visible = "";
        const remainder = line.text.slice(visible.length);
        const tight = line.type === "signature" || line.type === "title";
        return (
          <p key={i} style={tight ? { marginTop: 0, lineHeight: 1.3 } : undefined}>
            {visible}
            {isCurrent && <span className="story-type-caret" aria-hidden />}
            {remainder && (
              <span aria-hidden style={{ visibility: "hidden" }}>
                {remainder}
              </span>
            )}
          </p>
        );
      })}
    </div>
  );
};

export const TypewriterLetter = ({ className }: { className?: string }) => (
  <figure className={className}>
    {/* The whole typing machine — paper feeds out of the typewriter, exactly
      * like the About page, at the About page's own size. The paper sits
      * behind (z-10); the typewriter in front (z-30) is pulled up over the
      * paper's reserved bottom padding so the page rolls out of the platen.
      * The paper's pb + the typewriter's negative margin pin the platen just
      * below the signature (815 − 836 = −21px at lg), which holds at any letter
      * length, so the condensed letter still aligns at full size. overflow-x
      * crops the wide typewriter's sides on narrow viewports, like About. */}
    <div className="relative overflow-hidden px-8 pb-24 md:px-8 md:pb-28">
      <div className="relative z-10 mx-auto max-w-lg md:max-w-xl lg:max-w-2xl">
        <div
          className="relative px-6 pt-8 pb-[435px] text-[#0A0A0B] md:px-12 md:pt-12 md:pb-[725px] lg:pt-14 lg:pb-[815px]"
          style={{
            background: "linear-gradient(180deg, #FDF8EE 0%, #F8F1E1 100%)",
            boxShadow:
              "0 32px 64px -24px rgba(54,51,41,0.22), 0 12px 24px -12px rgba(54,51,41,0.12), inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(0,0,0,0.04)",
            border: "1px solid rgba(232,217,197,0.7)",
          }}
        >
          {/* Subtle paper grain — same as the About page. */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(0,0,0,0.4) 0.5px, transparent 1px), radial-gradient(circle at 80% 60%, rgba(0,0,0,0.3) 0.5px, transparent 1px)",
              backgroundSize: "3px 3px, 5px 5px",
            }}
          />
          <FounderLetter />
        </div>
      </div>

      {/* Typewriter — in front of the paper, the About page's exact widths,
        * overlap AND breakout (-mx-4 on mobile so the 575px image is cropped to
        * the full viewport, mx-auto from md up) so it behaves exactly like the
        * live About page at every width. */}
      <div className="relative z-30 mx-auto max-w-7xl pointer-events-none -mx-8 md:mx-auto md:-mx-0">
        <div className="flex justify-center -mt-[450px] md:-mt-[740px] lg:-mt-[836px]">
          <img
            src="/images/type.webp"
            alt=""
            aria-hidden
            draggable={false}
            className="block h-auto w-[575px] max-w-none -translate-x-[10px] select-none md:w-[940px] md:-translate-x-[20px] lg:w-[1060px]"
            style={{ filter: "drop-shadow(0 32px 48px rgba(54,51,41,0.22))" }}
          />
        </div>
      </div>
    </div>

    <figcaption className="mx-auto mt-3 max-w-2xl px-6 text-center text-sm leading-6 text-[#6E6B68]">
      Rebuilt natively — the founder letter rolling out of the typewriter,
      typing itself to the signature, exactly as it does on the About page.
    </figcaption>
  </figure>
);
