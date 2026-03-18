import { Analytics } from "@vercel/analytics/react";
import AnimatedLanding from "./components/AnimatedLanding";

export default function App() {
  return (
    <div className="size-full flex items-center justify-center">
      <AnimatedLanding />
      <Analytics />
    </div>
  );
}