import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";

// Globestudio brand mark — dotted-globe wordmark glyph (source viewBox 915×523).
const LOGO_PATH =
  "M457.415 0C577.077 0 687.642 25.3348 769.933 68.4814C850.058 110.493 914.83 176.387 914.83 261.239C914.83 346.091 850.059 411.986 769.933 453.998C687.642 497.145 577.076 522.479 457.415 522.479C337.754 522.478 227.188 497.145 144.897 453.998C64.7716 411.986 0 346.091 0 261.239C4.95911e-05 176.387 64.7719 110.493 144.897 68.4814C227.188 25.3348 337.753 2.28882e-05 457.415 0ZM457.415 30C341.604 30 236.013 54.5808 158.828 95.0508C82.3501 135.15 30 193.157 30 261.239C30 329.321 82.35 387.329 158.828 427.429C236.013 467.899 341.604 492.478 457.415 492.479C573.226 492.479 678.817 467.899 756.002 427.429C832.48 387.329 884.83 329.321 884.83 261.239C884.83 193.157 832.48 135.15 756.002 95.0508C678.817 54.5808 573.226 30 457.415 30ZM447.762 379.399C448.207 385.1 448.416 390.819 448.416 396.496V462.225C393.093 459.109 343.637 427.435 312.534 379.399H447.762ZM602.297 379.399C573.461 423.933 528.851 454.403 478.416 461.092V396.495C478.416 390.818 478.626 385.099 479.071 379.399H602.297ZM277.807 379.399C290.681 403.351 307.364 424.569 326.986 441.969C296.377 431.761 268.782 418.103 245.271 401.813C235.114 394.776 225.762 387.283 217.272 379.399H277.807ZM697.559 379.399C689.069 387.283 679.717 394.776 669.56 401.813C646.049 418.103 618.453 431.761 587.842 441.969C607.465 424.569 624.149 403.351 637.024 379.399H697.559ZM175.928 379.399C189.539 395.616 205.789 410.449 224.119 423.605C205.747 416.765 188.567 409.148 172.759 400.859C159.8 394.065 147.882 386.891 137.044 379.399H175.928ZM777.786 379.399C766.948 386.891 755.03 394.065 742.071 400.859C726.264 409.148 709.083 416.764 690.712 423.604C709.042 410.448 725.293 395.616 738.903 379.399H777.786ZM130.606 271.081C132.238 298.946 140.758 325.294 154.762 349.399H102.487V350.88C77.6296 325.983 63.2504 298.815 60.4912 271.081H130.606ZM854.339 271.081C851.58 298.814 837.201 325.982 812.344 350.879V349.399H760.069C774.073 325.294 782.593 298.946 784.225 271.081H854.339ZM248.657 271.081C249.707 298.614 255.138 325.02 264.234 349.399H190.517C173.029 325.271 162.667 298.726 160.673 271.081H248.657ZM334.331 271.081C354.515 271.081 375.013 273.327 392.854 282.765C395.181 283.995 397.477 285.281 399.739 286.62C423.013 300.39 436.294 323.473 442.929 349.399H296.469C286.157 325.652 279.875 299.2 278.681 271.081H334.331ZM636.15 271.081C634.956 299.2 628.673 325.652 618.361 349.399H483.903C490.538 323.47 503.821 300.385 527.098 286.615C529.358 285.278 531.651 283.994 533.975 282.765C551.816 273.328 572.314 271.081 592.497 271.081H636.15ZM754.158 271.081C752.164 298.726 741.802 325.271 724.314 349.399H650.597C659.693 325.02 665.124 298.614 666.174 271.081H754.158ZM161.177 162.763C145.3 186.682 134.92 213.045 131.53 241.081H62.0566C67.6616 213.644 84.6358 186.976 111.855 162.763H161.177ZM268.353 162.763C258.051 186.955 251.434 213.376 249.259 241.081H161.811C165.958 213.195 178.644 186.623 198.55 162.763H268.353ZM443.129 162.763C436.563 189.009 423.25 212.422 399.741 226.332C398.682 226.959 397.615 227.574 396.542 228.177C378.028 238.58 356.428 241.081 335.191 241.081H279.352C281.843 212.721 289.534 186.243 301.286 162.763H443.129ZM613.544 162.763C625.296 186.243 632.988 212.721 635.479 241.081H591.638C570.401 241.081 548.801 238.58 530.287 228.177C529.216 227.575 528.152 226.962 527.096 226.337C503.584 212.427 490.268 189.012 483.702 162.763H613.544ZM716.281 162.763C736.187 186.623 748.873 213.195 753.021 241.081H665.572C663.397 213.376 656.781 186.955 646.479 162.763H716.281ZM802.975 162.763C830.194 186.976 847.169 213.644 852.773 241.081H783.301C779.911 213.045 769.531 186.682 753.654 162.763H802.975ZM224.114 98.876C209.747 109.189 196.658 120.531 185.115 132.763H152.99C159.282 128.948 165.874 125.23 172.759 121.62C188.565 113.332 205.744 105.717 224.114 98.876ZM326.986 80.5088C310.229 95.3673 295.617 113.011 283.688 132.763H229.15C234.271 128.598 239.648 124.562 245.271 120.665C268.782 104.376 296.376 90.7163 326.986 80.5088ZM448.416 116.456C448.416 121.871 448.227 127.324 447.823 132.763H319.678C350.932 90.5437 397.157 63.1396 448.416 60.2529V116.456ZM478.416 61.3857C524.855 67.5446 566.357 93.8659 595.152 132.763H479.009C478.605 127.325 478.416 121.872 478.416 116.457V61.3857ZM587.842 80.5088C618.453 90.7164 646.049 104.375 669.56 120.665C675.183 124.562 680.56 128.598 685.681 132.763H631.143C619.214 113.01 604.599 95.3675 587.842 80.5088ZM690.717 98.876C709.086 105.716 726.265 113.332 742.071 121.62C748.957 125.23 755.548 128.948 761.84 132.763H729.716C718.173 120.531 705.084 109.189 690.717 98.876Z";

// Live Globestudio scene config — the exact ASCII shader render, palette-matched
// to alevizio (ink #1E1E1E on cream #dedbd1). transparent:true lets the cream
// card show through the glyph gaps (requires the embed's color-scheme fix, see
// globestudio PR #4). Edit here to swap in a different globe.
const GLOBE_CONFIG = {
  version: 1,
  selection: "world",
  stateSelection: "all",
  transparent: true,
  backgroundStyle: "transparent",
  density: 90,
  dotSize: 25,
  // Dense ASCII shader reading as a SOLID sphere: light dots (bright land →
  // dense glyphs) over a dark surface (ocean → sparse glyphs), so the whole
  // ball fills with graphite characters, denser on the continents. Requires the
  // asciiPass "fill the sphere" shader fix (globestudio).
  dotColor: "#e6e3da",
  dotColorAlpha: 0.95,
  dotsVisible: true,
  shape: "Circle",
  dotRotation: 335,
  shapeRotationSpeed: 54,
  sizeVary: true,
  renderMode: "dots",
  mapDepth: 55,
  tiltX: 0,
  tiltY: 0,
  shaderSettings: { effect: "ascii", cellSize: 5, intensity: 30, threshold: 50, split: 7, grain: 0, scanlines: 0, warp: 24, motion: 0 },
  globeSettings: {
    autoSpin: true,
    autoSpinSpeed: 35,
    grid: false,
    network: false,
    routes: false,
    glow: false,
    glowStrength: 0,
    surface: true,
    surfaceStrength: 90,
    surfaceColor: "#26262c",
  },
  animationsEnabled: true,
};

// Production Globestudio — has the ASCII shader, the transparent-embed
// color-scheme fix, and the asciiPass sphere-fill fix (PRs #3, #4, #5, deployed).
const GLOBESTUDIO_ORIGIN = "https://globestudio.app";

export default function GlobestudioCard() {
  // Honor prefers-reduced-motion: freeze the globe (no autospin / no shader
  // animation) for users who ask for it, while keeping the static sphere visual.
  // The iframe can't read the parent's media query, so we bake the preference
  // into the embed config here. (WCAG 2.2.2 Pause/Stop/Hide.)
  const reduceMotion = useReducedMotion();

  const embedUrl = useMemo(() => {
    const config = {
      ...GLOBE_CONFIG,
      animationsEnabled: !reduceMotion,
      globeSettings: { ...GLOBE_CONFIG.globeSettings, autoSpin: !reduceMotion },
    };
    const c = encodeURIComponent(JSON.stringify(config));
    return `${GLOBESTUDIO_ORIGIN}/embed?c=${c}&theme=light`;
  }, [reduceMotion]);

  return (
    <motion.a
      href="https://globestudio.app"
      target="_blank"
      rel="noopener noreferrer"
      className="group pixel-corners relative flex w-[78vw] max-w-[320px] shrink-0 snap-start flex-col items-start gap-8 overflow-hidden lg:w-full bg-[#1E1E1E]/[0.06] px-5 py-4 backdrop-blur-sm font-['Instrument_Sans',sans-serif] text-[#1E1E1E] hover:bg-[#1E1E1E]/[0.1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E1E1E]"
      style={{ fontVariationSettings: "'wdth' 100" }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Live Globestudio globe — solid dark sphere with light dotted
          continents, transparent around the sphere so the cream shows. Spins on
          its axis. Wrapped in an overflow-hidden layer because iframes can
          escape the card's clip-path. */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{ contain: "paint" }}
      >
        <iframe
          src={embedUrl}
          title="Globestudio globe"
          aria-hidden="true"
          tabIndex={-1}
          loading="lazy"
          // Rendered at display size (not upscaled) so the dots stay crisp.
          className="select-none absolute right-0 top-1/2 h-[440px] w-[440px]"
          style={{
            border: 0,
            colorScheme: "light",
            background: "transparent",
            // Anchored to the card's RIGHT edge (right-0) so the sphere crops
            // identically at any card width — desktop 300px and the variable
            // mobile snap-card (78vw, max 320px). +189px keeps the desktop crop
            // pixel-identical to the old center-offset version (W=300 → right=489).
            transform: "translate(189px, -50%) translate(0px, 29px) scale(1)",
            opacity: 0.4,
          }}
        />
      </div>

      {/* "NEW" pill — top-right corner */}
      <span className="pixel-corners-sm absolute right-4 top-4 z-20 bg-[#1E1E1E] px-[5px] py-[3px] text-[8px] font-bold uppercase leading-none tracking-[0.14em] text-[#dedbd1]">
        new
      </span>

      {/* Foreground content */}
      <svg
        className="relative z-10 shrink-0 w-[46px] h-auto text-[#1E1E1E]"
        viewBox="0 0 915 523"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={LOGO_PATH} />
      </svg>
      <div className="relative z-10 flex flex-col gap-0.5">
        <div className="text-[14px] font-semibold leading-tight">
          globestudio
        </div>
        <p className="max-w-[185px] text-balance text-[12px] leading-snug text-[#1E1E1E]/60">
          open-source dotted maps &amp; 3d globes for designers.
        </p>
      </div>
    </motion.a>
  );
}
