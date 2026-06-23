import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

export type HoverPreviewPoint = { x: number; y: number };

const CARD_WIDTH = 320;
const CARD_HEIGHT = 224; // 16:9 video + caption strip
const CURSOR_OFFSET_X = 28;
const VIEWPORT_EDGE = 16;

const SPRING = { stiffness: 400, damping: 40, mass: 0.7 };

const placeCard = (clientX: number, clientY: number) => ({
  // Trail to the right of the cursor, vertically centered, clamped to viewport.
  x: Math.min(clientX + CURSOR_OFFSET_X, window.innerWidth - CARD_WIDTH - VIEWPORT_EDGE),
  y: Math.min(
    Math.max(clientY - CARD_HEIGHT / 2, VIEWPORT_EDGE),
    window.innerHeight - CARD_HEIGHT - VIEWPORT_EDGE
  ),
});

/**
 * Floating video card that follows the cursor while a trigger element is
 * hovered. Mount it anywhere; it portals to <body> so ancestor transforms
 * and overflow clipping can't break its fixed positioning. Purely
 * decorative (aria-hidden) — the trigger link carries the semantics.
 * `entry` is the pointer position at hover start (null = hidden).
 */
export const HoverVideoPreview = ({
  entry,
  videoSrc,
  poster,
  label,
}: {
  entry: HoverPreviewPoint | null;
  videoSrc: string;
  poster?: string;
  label?: string;
}) => {
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  useEffect(() => {
    if (!entry) return;
    const start = placeCard(entry.x, entry.y);
    // Jump (don't animate) to the hover point so the card never flies in
    // from its previous resting position.
    rawX.jump(start.x);
    rawY.jump(start.y);
    x.jump(start.x);
    y.jump(start.y);
    const onMove = (e: MouseEvent) => {
      const next = placeCard(e.clientX, e.clientY);
      rawX.set(next.x);
      rawY.set(next.y);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [entry, rawX, rawY, x, y]);

  // A cursor-chasing card is itself motion — skip it entirely for
  // reduced-motion users; the underlying link still works.
  if (reduceMotion) return null;

  return createPortal(
    <AnimatePresence>
      {entry && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-50"
          style={{ x, y }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-[320px] overflow-hidden rounded-lg bg-[#1E1E1E] shadow-[0_24px_64px_-16px_rgba(30,30,30,0.45)]">
            <video
              src={videoSrc}
              poster={poster}
              className="block aspect-video w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            {label && (
              <p className="bg-[#dedbd1] px-3 py-2 text-[11px] tracking-[0.05em] text-[#1E1E1E] font-['Instrument_Sans',sans-serif]">
                {label} →
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
