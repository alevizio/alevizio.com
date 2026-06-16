import { Analytics } from "@vercel/analytics/react";
import { MotionConfig } from "motion/react";
import AnimatedLanding from "./components/AnimatedLanding";

export default function App() {
  return (
    // reducedMotion="user" makes every Motion transform/layout animation on the
    // page (logo draw, copy slide-ups, the card entrance stagger) collapse to its
    // resting state for visitors who set prefers-reduced-motion — opacity fades
    // are kept. Matches the convention already used in HoverVideoPreview.
    <MotionConfig reducedMotion="user">
      <div className="size-full flex items-center justify-center">
        <AnimatedLanding />
        <Analytics />
      </div>
    </MotionConfig>
  );
}