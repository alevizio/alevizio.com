import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import svgPaths from "../../imports/svg-ectekmh7x3";
import { moonFrames } from "../../imports/moon-frames";

export default function AnimatedLanding() {
  const [frameIndex, setFrameIndex] = useState(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const frameDuration = 200; // ms per frame
    const animate = (time: number) => {
      if (time - lastTimeRef.current >= frameDuration) {
        setFrameIndex((prev) => (prev + 1) % moonFrames.length);
        lastTimeRef.current = time;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="bg-[#dedbd1] relative w-full h-full min-h-screen overflow-hidden" data-name="alevizio.com">
      {/* ASCII Moon Background */}
      <div className="absolute inset-0 flex items-start justify-end pr-[5%] pt-[140px] pointer-events-none select-none">
        <pre
          className="text-[#1E1E1E] opacity-[0.25] leading-none whitespace-pre"
          style={{ fontSize: "clamp(7px, 1.2vw, 16px)", transform: "scaleX(0.83)", transformOrigin: "center" }}
        >
          {moonFrames[frameIndex]}
        </pre>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col gap-[140px] items-start p-[60px] md:p-[140px] max-w-[1440px]">
        {/* Animated Logo */}
        <motion.div
          className="h-[53px] relative shrink-0 w-[80.116px]"
          data-name="Union"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg className="absolute block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80.1162 53">
            <path d={svgPaths.p3e2d6e80} fill="#1E1E1E" id="Union" />
          </svg>
        </motion.div>

        {/* Animated Text Content */}
        <div className="flex flex-col font-['Instrument_Sans',sans-serif] font-normal gap-4 items-start leading-[normal] text-[#1E1E1E] max-w-[674px]">
          <motion.p
            className="text-[clamp(28px,4vw,52px)]"
            style={{ fontVariationSettings: "'wdth' 100" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            a relentless mind shaping product, brand & interaction
          </motion.p>
          <motion.p
            className="text-[clamp(14px,1.25vw,18px)] max-w-[625px]"
            style={{ fontVariationSettings: "'wdth' 100" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            I design products, identities, and interactions that bring clarity to complex ideas — from early concepts to polished systems used by real people.
          </motion.p>
          <motion.div
            className="flex items-center gap-4 mt-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Instagram */}
            <a href="https://www.instagram.com/alevizio" target="_blank" rel="noopener noreferrer" className="text-[#1E1E1E] opacity-60 hover:opacity-100 transition-opacity">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            {/* X / Twitter */}
            <a href="https://x.com/alevizio" target="_blank" rel="noopener noreferrer" className="text-[#1E1E1E] opacity-60 hover:opacity-100 transition-opacity">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/alevizio/" target="_blank" rel="noopener noreferrer" className="text-[#1E1E1E] opacity-60 hover:opacity-100 transition-opacity">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            {/* Dribbble */}
            <a href="https://dribbble.com/alevizio" target="_blank" rel="noopener noreferrer" className="text-[#1E1E1E] opacity-60 hover:opacity-100 transition-opacity">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" /><path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" /><path d="M8.56 2.75c4.37 6 6 12.38 7.44 20.12" />
              </svg>
            </a>
            {/* SoundCloud */}
            <a href="https://soundcloud.com/alevizio" target="_blank" rel="noopener noreferrer" className="text-[#1E1E1E] opacity-60 hover:opacity-100 transition-opacity">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.56 8.87V17h8.76c1.85-.13 3.32-1.57 3.32-3.35 0-1.85-1.56-3.34-3.46-3.34-.47 0-.91.1-1.32.27C18.4 7.87 15.95 6 13.07 6c-.52 0-1.03.07-1.51.21v.02zm-1.75.66V17h.93V9.16a5.3 5.3 0 0 0-.93.37m-1.68 1.12V17h.93v-5.96c-.27.2-.53.42-.77.67l-.16.15v-.21zm-1.69 2.23V17h.94v-3.72c-.13.35-.23.71-.28 1.09l-.66-.49zm-1.68.55V17h.93v-3.17l-.93-.4zm-1.69.83V17h.94v-2.33c-.22.1-.44.22-.66.36l-.28.23zM1 14.24V17h.93v-2.44L1 14.24z" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
