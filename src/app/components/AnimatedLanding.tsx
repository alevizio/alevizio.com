import { motion } from "motion/react";
import { lazy, Suspense, useState } from "react";
import AsciiRain from "./AsciiRain";
import CompanyLogos from "./CompanyLogos";
import GlobestudioCard from "./GlobestudioCard";
import SaboteursCard from "./SaboteursCard";
import CurbCard from "./CurbCard";
import HoraCeroCard from "./HoraCeroCard";
import { LogoMark } from "./LogoMark";

// Below the fold, so it loads after the hero instead of with it (~25 KB
// gzipped: the timeline component plus tailwind-merge for its cn()).
const CareerTimeline = lazy(() => import("./CareerTimeline"));

export default function AnimatedLanding() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("viziomas@gmail.com").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    // overflow-clip, not hidden: hidden would make this box the scroller
    // the project cards stick in, and they would never pin.
    <main className="bg-[#dedbd1] relative w-full h-full min-h-screen overflow-clip" data-name="alevizio.com">
      {/* ASCII Rain Background — ambient drops + mouse ripples */}
      <AsciiRain />

      {/* The project cards and the hero: ending this box is what lets the
          card row (below lg) leave with the hero instead of covering the
          timeline. */}
      <div className="flex flex-col">
      {/* Project cards. ≥lg (1024px): vertical stack, top-right, 300px wide —
          absolute, so it scrolls away with the hero instead of covering the
          timeline's right end (the present) below it.
          <lg (mobile + tablet + small laptops): a snap-scrolling horizontal row
          — swipe between Globestudio → curb → saboteurs → hora cero (a slim
          line under saboteurs in the stack). It is laid out after
          the hero (order-last, so the source and tab order stay as they were)
          and sticky: pinned to the bottom of the screen while the hero is on
          it, then it settles under the logos and scrolls away. The stack
          waits until lg so the 300px column never collides with the headline
          on narrow desktops (the overlap clears around 1146px). */}
      <div className="sticky bottom-4 z-20 order-last mb-[96px] md:mb-[120px] flex flex-row gap-3 overflow-x-auto scroll-px-4 px-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:absolute lg:bottom-auto lg:right-8 lg:top-8 lg:mb-0 lg:w-[300px] lg:flex-col lg:overflow-visible lg:px-0 lg:snap-none">
        <GlobestudioCard />
        <CurbCard />
        <SaboteursCard />
        <HoraCeroCard />
      </div>

      {/* Foreground Content */}
      {/* ≥lg: 140px all round (the cards sit top-right there). Below lg the
          bottom padding is the gap above the card row, which follows the
          hero. */}
      <div className="relative z-10 flex flex-col justify-between items-start p-[60px] md:p-[140px] md:pb-[80px] lg:pb-[140px] max-w-[1440px] min-h-screen">
        <div className="flex flex-col gap-[96px] items-start">
        {/* The AV mark in 3D: it turns in on load, and once per hover or tap.
            64px tall on phones, 72px from md (the old flat mark was 53px). */}
        <LogoMark className="h-16 w-auto shrink-0 md:h-[72px]" />

        {/* Animated Text Content */}
        <div className="flex flex-col font-['Instrument_Sans',sans-serif] font-normal gap-4 items-start leading-[normal] text-[#1E1E1E] max-w-[674px] lg:max-w-[520px] xl:max-w-[674px]">
          <motion.h1
            className="text-[clamp(28px,4vw,52px)] font-normal leading-[1.05]"
            style={{ fontVariationSettings: "'wdth' 100" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            a relentless mind shaping product, brand & interaction
          </motion.h1>
          {/* Canonical positioning + named clients as real text for JS-rendering
              crawlers (the logos are SVGs); visually hidden, read by Google + a11y. */}
          <p className="sr-only">
            Alejandro Vizio is a product and brand designer in San Francisco who
            designs product and brand as one system. He was a partner and later
            CEO at Aerolab (8+ years) and led design at Pachama (5+ years,
            acquired by Carbon Direct in 2025), and has worked on product and
            brand for Planta, Messa, Earthscale, Limai, Fudo, and Djooni.
          </p>
          <a className="sr-only" href="/about">
            About Alejandro Vizio and frequently asked questions
          </a>
          <motion.p
            className="text-[clamp(14px,1.25vw,18px)] max-w-[625px]"
            style={{ fontVariationSettings: "'wdth' 100" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            I design products, identities, and interactions that bring clarity to complex ideas — from early concepts to polished systems used by real people.
          </motion.p>
          <motion.button
            onClick={handleCopyEmail}
            className="text-[clamp(14px,1.25vw,18px)] font-semibold text-[#1E1E1E] cursor-pointer bg-transparent border-none p-0 text-left relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[1px] after:bg-[#1E1E1E] after:w-0 hover:after:w-full after:transition-all after:duration-300 hover:opacity-80 transition-opacity"
            style={{ fontVariationSettings: "'wdth' 100" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {copied ? "email copied ✓" : "let's make something meaningful →"}
          </motion.button>
          <div className="flex items-center gap-7 mt-4">
            {/* LinkedIn - Pixelarticons Pro */}
            <motion.a href="https://www.linkedin.com/in/alevizio/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="text-[#1E1E1E] hover:opacity-60 transition-opacity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="1" y="8" width="6" height="2"/><rect x="1" y="20" width="6" height="2"/><rect x="1" y="10" width="2" height="10"/><rect x="5" y="10" width="2" height="10"/><rect x="9" y="20" width="6" height="2"/><rect x="9" y="10" width="2" height="10"/><rect x="13" y="8" width="6" height="2"/><rect x="17" y="20" width="6" height="2"/><rect x="21" y="12" width="2" height="8"/><rect x="17" y="14" width="2" height="6"/><rect x="13" y="12" width="4" height="2"/><rect x="9" y="8" width="4" height="2"/><rect x="19" y="10" width="2" height="2"/><rect x="13" y="14" width="2" height="6"/><rect x="3" y="1" width="2" height="2"/><rect x="1" y="3" width="2" height="2"/><rect x="3" y="5" width="2" height="2"/><rect x="5" y="3" width="2" height="2"/>
              </svg>
            </motion.a>
            {/* Dribbble - Custom Pixel Art */}
            <motion.a href="https://dribbble.com/alevizio" aria-label="Dribbble" target="_blank" rel="noopener noreferrer" className="text-[#1E1E1E] hover:opacity-60 transition-opacity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.9 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="8" y="0" width="8" height="2"/><rect x="4" y="2" width="4" height="2"/><rect x="16" y="2" width="4" height="2"/><rect x="2" y="4" width="2" height="4"/><rect x="20" y="4" width="2" height="4"/><rect x="0" y="8" width="2" height="8"/><rect x="22" y="8" width="2" height="8"/><rect x="2" y="16" width="2" height="4"/><rect x="20" y="16" width="2" height="4"/><rect x="4" y="20" width="4" height="2"/><rect x="16" y="20" width="4" height="2"/><rect x="8" y="22" width="8" height="2"/><rect x="0" y="10" width="24" height="2"/><rect x="6" y="2" width="2" height="2"/><rect x="8" y="4" width="2" height="2"/><rect x="10" y="6" width="2" height="2"/><rect x="12" y="8" width="2" height="2"/><rect x="12" y="12" width="2" height="2"/><rect x="14" y="14" width="2" height="2"/><rect x="16" y="16" width="2" height="2"/><rect x="18" y="18" width="2" height="2"/>
              </svg>
            </motion.a>
            {/* GitHub - Pixelarticons Pro */}
            <motion.a href="https://github.com/alevizio" aria-label="GitHub" target="_blank" rel="noopener noreferrer" className="text-[#1E1E1E] hover:opacity-60 transition-opacity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M5 2H9V4H7V6H5V2Z"/><path d="M5 12H3V6H5V12Z"/><path d="M7 14H5V12H7V14Z"/><path fillRule="evenodd" clipRule="evenodd" d="M9 16V14H7V16H3V14H1V16H3V18H7V22H9V18H11V16H9ZM9 16V18H7V16H9Z"/><path d="M15 4V6H9V4H15Z"/><path d="M19 6H17V4H15V2H19V6Z"/><path d="M19 12V6H21V12H19Z"/><path d="M17 14V12H19V14H17Z"/><path d="M15 16V14H17V16H15Z"/><path d="M15 18H13V16H15V18Z"/><path d="M15 18H17V22H15V18Z"/>
              </svg>
            </motion.a>
            {/* Instagram - Pixelarticons Pro */}
            <motion.a href="https://www.instagram.com/alevizio" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-[#1E1E1E] hover:opacity-60 transition-opacity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.1 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="2" width="12" height="2"/><rect x="6" y="20" width="12" height="2"/><rect x="2" y="6" width="2" height="12"/><rect x="20" y="6" width="2" height="12"/><rect x="16" y="6" width="2" height="2"/><rect x="18" y="4" width="2" height="2"/><rect x="18" y="18" width="2" height="2"/><rect x="4" y="4" width="2" height="2"/><rect x="4" y="18" width="2" height="2"/><rect x="10" y="8" width="4" height="2"/><rect x="8" y="10" width="2" height="4"/><rect x="10" y="14" width="4" height="2"/><rect x="14" y="10" width="2" height="4"/>
              </svg>
            </motion.a>
            {/* X / Twitter - Pixelarticons Pro */}
            <motion.a href="https://x.com/alevizio" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer" className="text-[#1E1E1E] hover:opacity-60 transition-opacity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.2 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="2" y="4" width="6" height="2"/><rect x="4" y="6" width="2" height="2"/><rect x="6" y="8" width="2" height="2"/><rect x="8" y="10" width="2" height="2"/><rect x="10" y="12" width="2" height="2"/><rect x="12" y="14" width="2" height="2"/><rect x="14" y="16" width="2" height="2"/><rect x="16" y="18" width="5" height="2"/><rect x="8" y="6" width="2" height="2"/><rect x="10" y="8" width="2" height="2"/><rect x="12" y="10" width="2" height="2"/><rect x="14" y="8" width="2" height="2"/><rect x="4" y="18" width="2" height="2"/><rect x="16" y="6" width="2" height="2"/><rect x="6" y="16" width="2" height="2"/><rect x="18" y="4" width="2" height="2"/><rect x="8" y="14" width="2" height="2"/><rect x="14" y="12" width="2" height="2"/><rect x="16" y="14" width="2" height="2"/><rect x="18" y="16" width="2" height="2"/><rect x="20" y="18" width="2" height="2"/>
              </svg>
            </motion.a>
            {/* SoundCloud - Pixelarticons Pro (music) */}
            <motion.a href="https://soundcloud.com/alevizio" aria-label="SoundCloud" target="_blank" rel="noopener noreferrer" className="text-[#1E1E1E] hover:opacity-60 transition-opacity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.3 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="4" y="12" width="4" height="2"/><rect x="2" y="14" width="2" height="4"/><rect x="4" y="18" width="4" height="2"/><rect x="8" y="6" width="2" height="12"/><rect x="18" y="6" width="2" height="12"/><rect x="12" y="14" width="2" height="4"/><rect x="14" y="12" width="4" height="2"/><rect x="14" y="18" width="4" height="2"/><rect x="10" y="4" width="8" height="2"/>
              </svg>
            </motion.a>
          </div>
        </div>

        </div>

        {/* Companies Section — appears last with gentle fade up */}
        <motion.div
          className="mt-auto pt-[120px] md:pt-[80px]"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <CompanyLogos />
        </motion.div>
      </div>
      </div>

      <Suspense fallback={null}>
        <CareerTimeline />
      </Suspense>
    </main>
  );
}
