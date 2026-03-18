import { motion } from "motion/react";
import svgPaths from "../../imports/svg-ectekmh7x3";
import AsciiRain from "./AsciiRain";
import CompanyLogos from "./CompanyLogos";

export default function AnimatedLanding() {
  return (
    <div className="bg-[#dedbd1] relative w-full h-full min-h-screen overflow-hidden" data-name="alevizio.com">
      {/* ASCII Rain Background — ambient drops + mouse ripples */}
      <AsciiRain />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col justify-between items-start p-[60px] md:p-[140px] max-w-[1440px] min-h-screen">
        <div className="flex flex-col gap-[140px] items-start">
        {/* Animated Logo — draws itself then fills */}
        <div className="h-[53px] relative shrink-0 w-[80.116px]" data-name="Union">
          <svg className="absolute block w-full h-full" viewBox="0 0 80.1162 53">
            <motion.path
              d={svgPaths.p3e2d6e80}
              stroke="#1E1E1E"
              strokeWidth={1.5}
              strokeLinejoin="miter"
              fill="#1E1E1E"
              initial={{ pathLength: 0, fillOpacity: 0, strokeOpacity: 1 }}
              animate={{ pathLength: 1, fillOpacity: 1, strokeOpacity: 0 }}
              transition={{
                pathLength: { duration: 1.2, ease: "easeInOut" },
                fillOpacity: { duration: 0.6, delay: 1.0, ease: "easeIn" },
                strokeOpacity: { duration: 0.4, delay: 1.2 },
              }}
            />
          </svg>
        </div>

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
          <motion.a
            href="mailto:viziomas@gmail.com"
            className="text-[clamp(14px,1.25vw,18px)] font-semibold underline underline-offset-4 decoration-1 hover:opacity-60 transition-opacity"
            style={{ fontVariationSettings: "'wdth' 100" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            let's make something meaningful →
          </motion.a>
          <motion.div
            className="flex items-center gap-5 mt-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Instagram - Pixel Art */}
            <a href="https://www.instagram.com/alevizio" target="_blank" rel="noopener noreferrer" className="text-[#1E1E1E] opacity-60 hover:opacity-100 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="2" width="16" height="2"/><rect x="4" y="20" width="16" height="2"/><rect x="2" y="2" width="2" height="20"/><rect x="20" y="2" width="2" height="20"/><rect x="16" y="4" width="2" height="2"/><rect x="10" y="6" width="4" height="2"/><rect x="8" y="8" width="2" height="8"/><rect x="14" y="8" width="2" height="8"/><rect x="10" y="16" width="4" height="2"/><rect x="10" y="10" width="4" height="4"/>
              </svg>
            </a>
            {/* X / Twitter - Pixel Art */}
            <a href="https://x.com/alevizio" target="_blank" rel="noopener noreferrer" className="text-[#1E1E1E] opacity-60 hover:opacity-100 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="2" height="2"/><rect x="4" y="4" width="2" height="2"/><rect x="6" y="6" width="2" height="2"/><rect x="8" y="8" width="2" height="2"/><rect x="20" y="2" width="2" height="2"/><rect x="18" y="4" width="2" height="2"/><rect x="16" y="6" width="2" height="2"/><rect x="14" y="8" width="2" height="2"/><rect x="10" y="10" width="4" height="4"/><rect x="8" y="14" width="2" height="2"/><rect x="6" y="16" width="2" height="2"/><rect x="4" y="18" width="2" height="2"/><rect x="2" y="20" width="2" height="2"/><rect x="14" y="14" width="2" height="2"/><rect x="16" y="16" width="2" height="2"/><rect x="18" y="18" width="2" height="2"/><rect x="20" y="20" width="2" height="2"/>
              </svg>
            </a>
            {/* LinkedIn - Pixel Art */}
            <a href="https://www.linkedin.com/in/alevizio/" target="_blank" rel="noopener noreferrer" className="text-[#1E1E1E] opacity-60 hover:opacity-100 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="20" height="2"/><rect x="2" y="20" width="20" height="2"/><rect x="2" y="2" width="2" height="20"/><rect x="20" y="2" width="2" height="20"/><rect x="6" y="6" width="2" height="2"/><rect x="6" y="10" width="2" height="8"/><rect x="10" y="10" width="2" height="8"/><rect x="12" y="10" width="2" height="2"/><rect x="14" y="10" width="2" height="2"/><rect x="16" y="12" width="2" height="6"/>
              </svg>
            </a>
            {/* Dribbble - Pixel Art */}
            <a href="https://dribbble.com/alevizio" target="_blank" rel="noopener noreferrer" className="text-[#1E1E1E] opacity-60 hover:opacity-100 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="8" y="0" width="8" height="2"/><rect x="4" y="2" width="4" height="2"/><rect x="16" y="2" width="4" height="2"/><rect x="2" y="4" width="2" height="4"/><rect x="20" y="4" width="2" height="4"/><rect x="0" y="8" width="2" height="8"/><rect x="22" y="8" width="2" height="8"/><rect x="2" y="16" width="2" height="4"/><rect x="20" y="16" width="2" height="4"/><rect x="4" y="20" width="4" height="2"/><rect x="16" y="20" width="4" height="2"/><rect x="8" y="22" width="8" height="2"/><rect x="0" y="10" width="24" height="2"/><rect x="6" y="2" width="2" height="2"/><rect x="8" y="4" width="2" height="2"/><rect x="10" y="6" width="2" height="2"/><rect x="12" y="8" width="2" height="2"/><rect x="12" y="12" width="2" height="2"/><rect x="14" y="14" width="2" height="2"/><rect x="16" y="16" width="2" height="2"/><rect x="18" y="18" width="2" height="2"/>
              </svg>
            </a>
            {/* SoundCloud - Pixel Art */}
            <a href="https://soundcloud.com/alevizio" target="_blank" rel="noopener noreferrer" className="text-[#1E1E1E] opacity-60 hover:opacity-100 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="10" y="4" width="4" height="2"/><rect x="8" y="6" width="2" height="2"/><rect x="14" y="6" width="4" height="2"/><rect x="6" y="8" width="2" height="2"/><rect x="18" y="8" width="2" height="2"/><rect x="4" y="10" width="2" height="2"/><rect x="20" y="8" width="2" height="6"/><rect x="4" y="12" width="2" height="2"/><rect x="6" y="14" width="16" height="2"/><rect x="8" y="10" width="2" height="4"/><rect x="10" y="8" width="2" height="6"/><rect x="12" y="10" width="2" height="4"/><rect x="14" y="9" width="2" height="5"/><rect x="16" y="10" width="2" height="4"/><rect x="2" y="12" width="2" height="2"/><rect x="2" y="14" width="4" height="2"/>
              </svg>
            </a>
            {/* GitHub - Pixel Art */}
            <a href="https://github.com/alevizio" target="_blank" rel="noopener noreferrer" className="text-[#1E1E1E] opacity-60 hover:opacity-100 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="8" y="0" width="8" height="2"/><rect x="6" y="2" width="2" height="2"/><rect x="16" y="2" width="2" height="2"/><rect x="4" y="4" width="2" height="2"/><rect x="18" y="4" width="2" height="2"/><rect x="2" y="6" width="2" height="8"/><rect x="20" y="6" width="2" height="8"/><rect x="4" y="14" width="2" height="2"/><rect x="18" y="14" width="2" height="2"/><rect x="6" y="16" width="4" height="2"/><rect x="14" y="16" width="4" height="2"/><rect x="4" y="6" width="2" height="2"/><rect x="18" y="6" width="2" height="2"/><rect x="6" y="8" width="2" height="2"/><rect x="16" y="8" width="2" height="2"/><rect x="8" y="18" width="2" height="2"/><rect x="6" y="20" width="2" height="2"/><rect x="4" y="22" width="2" height="2"/><rect x="14" y="18" width="2" height="2"/><rect x="16" y="20" width="2" height="2"/><rect x="18" y="22" width="2" height="2"/>
              </svg>
            </a>
          </motion.div>
        </div>

        </div>

        {/* Companies Section — appears last with gentle fade up */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <CompanyLogos />
        </motion.div>
      </div>
    </div>
  );
}
