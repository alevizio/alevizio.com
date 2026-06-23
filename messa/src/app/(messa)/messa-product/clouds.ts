/**
 * Shared cloud configuration for the landing page.
 *
 * Two cloud arrays:
 *  - DEFAULT_HERO_CLOUDS — float behind the headline in the hero section
 *  - DEFAULT_FOOTER_CLOUDS — wrap the diff-section's color gradient at the
 *    bottom of the page
 *
 * Both feed off the same CloudCfg type and the same /images/cloud0*.png
 * sprite set, so the CloudCalibrator (?calibrate=clouds) can drive
 * either one with the same UI.
 *
 * Position values use CSS percentage strings ("1%", "-4%", etc.) so
 * clouds reflow relative to their section's container. The calibrator
 * converts dragged pixel deltas back into percent-of-parent values so
 * the snippet it emits round-trips through this file unchanged.
 */

/** Filenames available for cloud swaps (cycled in calibrator). */
export const CLOUD_IMAGES = [
  "cloud01.png",
  "cloud02.png",
  "cloud03.png",
  "cloud04.png",
  "cloud05.png",
] as const;

/** Single cloud overlay configuration. */
export type CloudCfg = {
  /** Filename within /public/images/. Cycle via CLOUD_IMAGES in the calibrator. */
  src: string;
  /** CSS pixel width. Height is auto-derived from the image's aspect ratio. */
  w: number;
  /** CSS percent or px offset from the parent's top edge. Defaults to undefined
   * if `bottom` is set instead. */
  top?: string;
  /** Alternative to `top` — measured from the parent's bottom edge. */
  bottom?: string;
  /** CSS percent or px offset from the parent's left edge. */
  left?: string;
  /** Alternative to `left` — measured from the parent's right edge. */
  right?: string;
  /** Hero only — name of the bob/drift @keyframes (heroCloudA … heroCloudF
   * are defined in hero-factory's style block). Footer clouds use
   * factoryCloudA/B automatically. */
  anim?: string;
  /** Bob/drift loop duration in seconds. */
  dur?: number;
  /** Delay before the bob loop starts, in seconds. */
  delay?: number;
  /** Hero only — true keeps the cloud visible on mobile (≤767px). False = hide
   * on mobile to avoid clutter on small viewports. Footer clouds ignore this. */
  mobile?: boolean;
  /** Optional fixed opacity (0–1). Product-section clouds use 0.85 so they
   * read as airy backdrops over the screenshots; hero/footer clouds typically
   * rely on the cloud PNG's own alpha and leave this undefined. */
  opacity?: number;

  /* ── Mobile (≤767px) overrides ──
   * When set, these win on small screens; any unset field falls back to the
   * desktop value. They let a cloud sit in a different spot/size on mobile
   * (where the layout differs a lot) without disturbing desktop. Set them
   * live via the calibrator at a narrow viewport — it writes these instead
   * of the desktop fields once the viewport is ≤767px. Vertical and
   * horizontal are resolved independently (see resolveCloudLayout): provide
   * mTop OR mBottom, mLeft OR mRight. */
  /** Mobile width override (px). Falls back to `w`. */
  mW?: number;
  mTop?: string;
  mBottom?: string;
  mLeft?: string;
  mRight?: string;

  /** Optional z-index. Used by the page-level cloud layers to sit some
   * clouds behind the product UI (z:2) and some in front (z:30). */
  z?: number;
};

/** Resolved, breakpoint-aware layout for a single cloud. The renderers call
 * this with the current `isMobile` so a cloud can carry independent mobile
 * placement. Vertical (top/bottom) and horizontal (left/right) axes each fall
 * back to the desktop value only when NO mobile override exists for that axis,
 * so a cloud can flip anchors (e.g. desktop `left`, mobile `right`). */
export type CloudLayout = {
  w: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
};

export const resolveCloudLayout = (c: CloudCfg, isMobile: boolean): CloudLayout => {
  const useMobileV = isMobile && (c.mTop != null || c.mBottom != null);
  const useMobileH = isMobile && (c.mLeft != null || c.mRight != null);
  return {
    w: isMobile && c.mW != null ? c.mW : c.w,
    top: useMobileV ? c.mTop : c.top,
    bottom: useMobileV ? c.mBottom : c.bottom,
    left: useMobileH ? c.mLeft : c.left,
    right: useMobileH ? c.mRight : c.right,
  };
};

/** Hero clouds — float behind the headline + factory illustration.
 * Positions/sizes calibrated via the live tool at ?calibrate=clouds —
 * see /src/components/landing/cloud-calibrator.tsx. */
export const DEFAULT_HERO_CLOUDS: CloudCfg[] = [
  { src: "cloud02.png", w: 250, top: "3.6%", left: "10.0%", anim: "heroCloudA", dur: 26, delay: 0, mobile: true, mW: 130, mTop: "14.0%", mLeft: "-17.4%" },
  { src: "cloud01.png", w: 230, top: "-5.7%", right: "4.4%", anim: "heroCloudD", dur: 30, delay: 2, mobile: true, mW: 120, mTop: "-5.0%", mRight: "-14.9%" },
  { src: "cloud02.png", w: 150, top: "29.0%", left: "9.6%", anim: "heroCloudE", dur: 24, delay: 4, mobile: true, mW: 95, mTop: "59.7%", mLeft: "8.4%" },
  { src: "cloud04.png", w: 175, top: "20.6%", right: "12.4%", anim: "heroCloudC", dur: 28, delay: 1.5, mobile: true, mW: 100, mTop: "15.9%", mRight: "-16.1%" },
  { src: "cloud01.png", w: 120, top: "27.3%", left: "-11.8%", anim: "heroCloudC", dur: 27, delay: 8, mobile: true, mW: 85, mTop: "41.3%", mLeft: "-1.2%" },
  { src: "cloud03.png", w: 150, top: "37.5%", right: "-1.8%", anim: "heroCloudA", dur: 31, delay: 5, mobile: true, mW: 95, mTop: "40.5%", mRight: "-12.2%" },
  { src: "cloud05.png", w: 78, top: "3.5%", left: "-8%", anim: "heroCloudB", dur: 22, delay: 6, mobile: true, mW: 45, mTop: "6%", mLeft: "-5%" },
  { src: "cloud01.png", w: 98, top: "4.2%", right: "-8.7%", anim: "heroCloudF", dur: 25, delay: 3, mobile: true, mW: 72, mTop: "58.4%", mRight: "0.3%" },
];

/** Product-section clouds — flank the app screenshot in the middle of the
 * page. Just two big puffs with their own drift animations (cloudDriftL on
 * the left, cloudDriftR on the right) and a fixed 0.85 opacity so they
 * sit lightly behind the foreground UI. Desktop-only via the hidden/md:block
 * Tailwind class in the renderer. */
export const DEFAULT_PRODUCT_CLOUDS: CloudCfg[] = [
  { src: "cloud03.png", w: 220, top: "24.2%", left:  "12.3%", anim: "cloudDriftL", dur: 8,  opacity: 0.85 },
  { src: "cloud02.png", w: 320, top: "22.3%", right: "8.3%",  anim: "cloudDriftR", dur: 10, opacity: 0.85 },
];

/** Footer clouds — sit behind the bottom of the diff-section, framing the
 * blue-gradient privacy callout area. No hero entry animation, just the
 * factoryCloudA/B drift. Positions/sizes calibrated via the live tool
 * at ?calibrate=clouds — see /src/components/landing/cloud-calibrator.tsx. */
export const DEFAULT_FOOTER_CLOUDS: CloudCfg[] = [
  /* Composition rule: clouds flank the centered FAQ accordion in the side
   * gutters (desktop) and fill the clear blue band BELOW it — never behind
   * the cards. `mobile: false` clouds (the side-gutter ones) are hidden on
   * small screens where the accordion goes full-width; the bottom-band clouds
   * stay since that zone is clear sky on every screen. */

  /* Side gutters of the FAQ accordion — desktop only. */
  { src: "cloud02.png", w: 200, top: "36%", left:  "-5%", dur: 30, delay: 0, mobile: false },
  { src: "cloud03.png", w: 220, top: "40%", right: "-5%", dur: 34, delay: 3, mobile: false },
  { src: "cloud01.png", w: 150, top: "52%", left:  "-4%", dur: 28, delay: 5, mobile: false },
  { src: "cloud04.png", w: 170, top: "54%", right: "-6%", dur: 26, delay: 2, mobile: false },

  /* Bottom blue band, below the accordion — clear sky on every screen.
   * Mobile placements pulled back on-screen (mW keeps them phone-sized);
   * tune them with the calibrator's Footer section sliders. */
  { src: "cloud03.png", w: 240, top: "82%", left:  "-2%", dur: 32, delay: 6, mobile: true, mW: 150, mTop: "83%", mLeft:  "-4%" },
  { src: "cloud02.png", w: 200, top: "85%", right: "-1%", dur: 30, delay: 9, mobile: true, mW: 130, mTop: "90%", mRight: "-3%" },
  { src: "cloud05.png", w: 70,  top: "78%", left:  "44%", dur: 24, delay: 4, mobile: true, mTop: "89.7%", mLeft: "56.3%" },
];

/** Product-area clouds — the page-level layer wrapping <ProductSection/>.
 * Split by z-index: z:2 drift BEHIND the dashboard, z:30 hover IN FRONT of
 * it. Desktop-only (mobile:false) by default; give them mobile overrides via
 * the calibrator if you want them on small screens. Anchored as % of the
 * ProductSection wrapper. */
export const DEFAULT_PRODUCT_AREA_CLOUDS: CloudCfg[] = [
  // Behind the dashboard (z:2)
  { src: "cloud03.png", w: 205, top: "-8.9%", left: "-6.9%", anim: "factoryCloudB", dur: 22, delay: 0, z: 2,  mobile: false },
  { src: "cloud05.png", w: 100, top: "0.3%", right: "32.4%", anim: "factoryCloudA", dur: 26, delay: 2, z: 2,  mobile: false },
  { src: "cloud05.png", w: 80,  top: "2.7%", left: "26.0%", anim: "factoryCloudB", dur: 24, delay: 5, z: 2,  mobile: false },
  { src: "cloud02.png", w: 180, top: "25.2%", right: "-5.2%", anim: "factoryCloudA", dur: 28, delay: 1, z: 2,  mobile: false },
  { src: "cloud01.png", w: 140, top: "10.4%", left: "5.6%", anim: "factoryCloudB", dur: 30, delay: 4, z: 2,  mobile: false },
  { src: "cloud05.png", w: 70,  top: "23.5%", right: "18.1%", anim: "factoryCloudA", dur: 20, delay: 6, z: 2,  mobile: false },
  { src: "cloud03.png", w: 220, top: "4.0%", right: "-9.1%", anim: "factoryCloudB", dur: 32, delay: 3, z: 2,  mobile: false },
  // In front of the dashboard (z:30)
  { src: "cloud04.png", w: 180, top: "46.8%", right: "-1.2%", anim: "factoryCloudB", dur: 18, delay: 0, z: 30, mobile: false },
  { src: "cloud02.png", w: 140, top: "59.6%", left: "7.8%", anim: "factoryCloudA", dur: 24, delay: 4, z: 30, mobile: false },
  { src: "cloud05.png", w: 90,  top: "-12.1%", right: "2.6%", anim: "factoryCloudB", dur: 20, delay: 2, z: 30, mobile: false },
];

/** Landscape / CTA clouds — the page-level "sky" layer over the landscape
 * illustration that backs DiffSection + CTASection. Bottom-anchored so they
 * sit just above the horizon. These are the clouds around the
 * "See talent clearly / Decide with confidence" CTA. */
export const DEFAULT_LANDSCAPE_CLOUDS: CloudCfg[] = [
  { src: "cloud03.png", w: 170, bottom: "28.7%", left: "0.3%", anim: "factoryCloudB", dur: 30, delay: 0, z: 5, mobile: false },
  { src: "cloud03.png", w: 160, bottom: "29.2%", right: "-3.9%", anim: "factoryCloudA", dur: 34, delay: 3, z: 5, mobile: false },
  { src: "cloud05.png", w: 93, bottom: "25.7%", left: "25.1%", anim: "factoryCloudB", dur: 22, delay: 6, z: 5, mobile: true, mW: 104, mBottom: "25.1%", mLeft: "-5.5%" },
  { src: "cloud05.png", w: 60, bottom: "25%", right: "16%", anim: "factoryCloudA", dur: 24, delay: 9, z: 5, mobile: true, mW: 124, mBottom: "24.6%", mRight: "-4.2%" },
  { src: "cloud03.png", w: 140, bottom: "39.6%", left: "5.1%", anim: "factoryCloudB", dur: 32, delay: 1, z: 5, mobile: false, mW: 134 },
  { src: "cloud04.png", w: 160, bottom: "39.8%", right: "3.6%", anim: "factoryCloudA", dur: 36, delay: 5, z: 5, mobile: false },
  { src: "cloud05.png", w: 80, bottom: "38.3%", left: "54.7%", anim: "factoryCloudB", dur: 20, delay: 7, z: 5, mobile: false },
  { src: "cloud01.png", w: 65, bottom: "34%", left: "22%", anim: "factoryCloudA", dur: 26, delay: 4, z: 5, mobile: true, mW: 170, mBottom: "35.6%", mLeft: "-13.5%" },
  { src: "cloud05.png", w: 70, bottom: "34%", right: "22%", anim: "factoryCloudB", dur: 22, delay: 11, z: 5, mobile: true, mBottom: "32.7%", mRight: "-5.5%" },
];

/** Site-footer clouds — used by the shared <SiteFooter> on the inner pages
 * (about, privacy, terms). Their landscape-wrap is short (just the CTA, no
 * FAQ like home), so these sit HIGHER in the sky around the CTA than the
 * home "landscape" set would. Bottom-anchored % of the SiteFooter wrap. */
export const DEFAULT_SITE_FOOTER_CLOUDS: CloudCfg[] = [
  /* TOP-anchored so they float in the blue sky around the CTA and stay clear
   * of the landscape image at the bottom (bottom-anchoring put them on the
   * hills). Edges only, no center cloud. */
  { src: "cloud02.png", w: 200, top: "-18.8%", left:  "10.4%", anim: "factoryCloudB", dur: 36, delay: 0, mobile: false, z: 5 },
  { src: "cloud03.png", w: 220, top: "-18.2%", right: "-3.3%", anim: "factoryCloudA", dur: 40, delay: 3, mobile: false, z: 5 },
  { src: "cloud01.png", w: 150, top: "13.8%", left:  "12.6%", anim: "factoryCloudB", dur: 34, delay: 2, mobile: false, z: 5 },
  { src: "cloud04.png", w: 170, top: "11.7%", right: "10.3%", anim: "factoryCloudA", dur: 38, delay: 4, mobile: false, z: 5 },
  { src: "cloud05.png", w: 85,  top: "7%",   left:  "-6%",   anim: "factoryCloudB", dur: 26, delay: 5, mobile: true,  z: 5 },
  { src: "cloud05.png", w: 75,  top: "5.9%", right: "-1.9%", anim: "factoryCloudA", dur: 28, delay: 7, mobile: true,  z: 5 },
];

/** Jobs-footer clouds — the careers page keeps its own "Don't see your role?"
 * CTA inside a taller landscape-wrap (the application card lives there), so it
 * gets its own calibrated set rather than reusing the short siteFooter wrap's
 * percentages. Bottom-anchored % of the jobs landscape-wrap. Same full-opacity,
 * breakpoint-aware, calibratable system as every other section. */
export const DEFAULT_JOBS_FOOTER_CLOUDS: CloudCfg[] = [
  /* Bottom-anchored, unlike the shared siteFooter set. The jobs landscape-wrap
   * is much TALLER than about/privacy/terms (its "Don't see your role?" card
   * carries a big pb-48/pb-64), so top-anchoring bunched the clouds up by the
   * card and left the sky empty with the landscape untouched. Anchoring from
   * the bottom keeps them floating in the sky just above the landscape horizon
   * — touching the footer image, clear of the footer links. */
  { src: "cloud02.png", w: 200, bottom: "63.4%", left:  "0.4%",   anim: "factoryCloudB", dur: 36, delay: 0, mobile: false, z: 5 },
  { src: "cloud03.png", w: 194, bottom: "68.4%", right: "6.4%",   anim: "factoryCloudA", dur: 40, delay: 3, mobile: false, z: 5 },
  { src: "cloud01.png", w: 150, bottom: "92.9%", left:  "-10.8%", anim: "factoryCloudB", dur: 34, delay: 2, mobile: false, z: 5 },
  { src: "cloud04.png", w: 170, bottom: "90.2%", right: "-7.5%",  anim: "factoryCloudA", dur: 38, delay: 4, mobile: false, z: 5 },
  { src: "cloud05.png", w: 85,  bottom: "87.1%", left:  "24.1%",  anim: "factoryCloudB", dur: 26, delay: 5, mobile: true,  z: 5 },
  { src: "cloud05.png", w: 75,  bottom: "63.3%", right: "-11.8%", anim: "factoryCloudA", dur: 28, delay: 7, mobile: true,  z: 5 },
];
