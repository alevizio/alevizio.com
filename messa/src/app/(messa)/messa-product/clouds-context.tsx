"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_FOOTER_CLOUDS,
  DEFAULT_HERO_CLOUDS,
  DEFAULT_PRODUCT_CLOUDS,
  DEFAULT_PRODUCT_AREA_CLOUDS,
  DEFAULT_LANDSCAPE_CLOUDS,
  DEFAULT_SITE_FOOTER_CLOUDS,
  DEFAULT_JOBS_FOOTER_CLOUDS,
  type CloudCfg,
} from "./clouds";
import { DEBUG_UI_ALLOWED } from "./debug-gate";

/**
 * Shared cloud state for the landing page.
 *
 * Lifts the three cloud arrays (hero / product / footer) plus the
 * ?calibrate=clouds toggle into one provider so the unified calibrator
 * panel can drive all three from a single accordion UI, while each
 * section's on-canvas handle overlay still mounts locally next to its
 * actual cloud <img>s for accurate positioning.
 *
 * State persists in-memory only — the user copies the emitted TS
 * snippets back into /landing/clouds.ts to make changes permanent.
 */

export type CloudSectionKey =
  | "hero"
  | "product"
  | "footer"
  | "productArea"
  | "landscape"
  | "siteFooter"
  | "jobsFooter";

export type CloudSection = {
  key: CloudSectionKey;
  label: string;
  exportConstName:
    | "DEFAULT_HERO_CLOUDS"
    | "DEFAULT_PRODUCT_CLOUDS"
    | "DEFAULT_FOOTER_CLOUDS"
    | "DEFAULT_PRODUCT_AREA_CLOUDS"
    | "DEFAULT_LANDSCAPE_CLOUDS"
    | "DEFAULT_SITE_FOOTER_CLOUDS"
    | "DEFAULT_JOBS_FOOTER_CLOUDS";
  clouds: CloudCfg[];
  setClouds: (c: CloudCfg[]) => void;
};

type CloudsContextValue = {
  sections: Record<CloudSectionKey, CloudSection>;
  /** True when ?calibrate=clouds is in the URL. */
  calibrate: boolean;
  /** Per-section: are the on-canvas handles rendered? Toggled from
   * the unified panel's "Handles on/off" buttons so the user can
   * focus on one section at a time. */
  handlesShown: Record<CloudSectionKey, boolean>;
  setHandlesShown: React.Dispatch<
    React.SetStateAction<Record<CloudSectionKey, boolean>>
  >;
};

const CloudsContext = createContext<CloudsContextValue | null>(null);

export const CloudsProvider = ({ children }: { children: React.ReactNode }) => {
  const [heroClouds, setHero] = useState<CloudCfg[]>(DEFAULT_HERO_CLOUDS);
  const [productClouds, setProduct] = useState<CloudCfg[]>(DEFAULT_PRODUCT_CLOUDS);
  const [footerClouds, setFooter] = useState<CloudCfg[]>(DEFAULT_FOOTER_CLOUDS);
  const [productAreaClouds, setProductArea] = useState<CloudCfg[]>(DEFAULT_PRODUCT_AREA_CLOUDS);
  const [landscapeClouds, setLandscape] = useState<CloudCfg[]>(DEFAULT_LANDSCAPE_CLOUDS);
  const [siteFooterClouds, setSiteFooter] = useState<CloudCfg[]>(DEFAULT_SITE_FOOTER_CLOUDS);
  const [jobsFooterClouds, setJobsFooter] = useState<CloudCfg[]>(DEFAULT_JOBS_FOOTER_CLOUDS);
  const [calibrate, setCalibrate] = useState(false);
  const [handlesShown, setHandlesShown] = useState<
    Record<CloudSectionKey, boolean>
  >({ hero: true, product: true, footer: true, productArea: true, landscape: true, siteFooter: true, jobsFooter: true });

  /* URL listener — flips calibrate on/off when ?calibrate=clouds is
   * added/removed (also reacts to history navigation). One place to
   * own this rather than per-section useEffects. */
  useEffect(() => {
    if (typeof window === "undefined" || !DEBUG_UI_ALLOWED) return;
    const sync = () => {
      const params = new URLSearchParams(window.location.search);
      setCalibrate(params.get("calibrate") === "clouds");
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  /* Stable wrapper setters so the section objects in `value` don't
   * change reference between renders (downstream useMemo deps stay
   * happy). The state setters from useState ARE stable, but wrapping
   * them in named callbacks documents intent. */
  const setHeroStable = useCallback((c: CloudCfg[]) => setHero(c), []);
  const setProductStable = useCallback((c: CloudCfg[]) => setProduct(c), []);
  const setFooterStable = useCallback((c: CloudCfg[]) => setFooter(c), []);
  const setProductAreaStable = useCallback((c: CloudCfg[]) => setProductArea(c), []);
  const setLandscapeStable = useCallback((c: CloudCfg[]) => setLandscape(c), []);
  const setSiteFooterStable = useCallback((c: CloudCfg[]) => setSiteFooter(c), []);
  const setJobsFooterStable = useCallback((c: CloudCfg[]) => setJobsFooter(c), []);

  const value = useMemo<CloudsContextValue>(
    () => ({
      calibrate,
      handlesShown,
      setHandlesShown,
      sections: {
        hero: {
          key: "hero",
          label: "Hero clouds",
          exportConstName: "DEFAULT_HERO_CLOUDS",
          clouds: heroClouds,
          setClouds: setHeroStable,
        },
        product: {
          key: "product",
          label: "Product clouds",
          exportConstName: "DEFAULT_PRODUCT_CLOUDS",
          clouds: productClouds,
          setClouds: setProductStable,
        },
        footer: {
          key: "footer",
          label: "Footer clouds (FAQ)",
          exportConstName: "DEFAULT_FOOTER_CLOUDS",
          clouds: footerClouds,
          setClouds: setFooterStable,
        },
        productArea: {
          key: "productArea",
          label: "Product-area clouds",
          exportConstName: "DEFAULT_PRODUCT_AREA_CLOUDS",
          clouds: productAreaClouds,
          setClouds: setProductAreaStable,
        },
        landscape: {
          key: "landscape",
          label: "Landscape / CTA clouds",
          exportConstName: "DEFAULT_LANDSCAPE_CLOUDS",
          clouds: landscapeClouds,
          setClouds: setLandscapeStable,
        },
        siteFooter: {
          key: "siteFooter",
          label: "Site footer clouds (about/privacy/terms)",
          exportConstName: "DEFAULT_SITE_FOOTER_CLOUDS",
          clouds: siteFooterClouds,
          setClouds: setSiteFooterStable,
        },
        jobsFooter: {
          key: "jobsFooter",
          label: "Jobs footer clouds",
          exportConstName: "DEFAULT_JOBS_FOOTER_CLOUDS",
          clouds: jobsFooterClouds,
          setClouds: setJobsFooterStable,
        },
      },
    }),
    [
      calibrate,
      handlesShown,
      heroClouds,
      productClouds,
      footerClouds,
      productAreaClouds,
      landscapeClouds,
      siteFooterClouds,
      jobsFooterClouds,
      setHeroStable,
      setProductStable,
      setFooterStable,
      setProductAreaStable,
      setLandscapeStable,
      setSiteFooterStable,
      setJobsFooterStable,
    ],
  );

  return (
    <CloudsContext.Provider value={value}>{children}</CloudsContext.Provider>
  );
};

/** Read everything from the context (sections + calibrate flag). */
export const useClouds = () => {
  const ctx = useContext(CloudsContext);
  if (!ctx) {
    /* During SSR or if a consumer is rendered outside the provider,
     * fall back to defaults so the page still renders correctly. */
    return {
      calibrate: false,
      handlesShown: {
        hero: true,
        product: true,
        footer: true,
        productArea: true,
        landscape: true,
        siteFooter: true,
        jobsFooter: true,
      },
      setHandlesShown: () => {},
      sections: {
        hero: {
          key: "hero" as const,
          label: "Hero clouds",
          exportConstName: "DEFAULT_HERO_CLOUDS" as const,
          clouds: DEFAULT_HERO_CLOUDS,
          setClouds: () => {},
        },
        product: {
          key: "product" as const,
          label: "Product clouds",
          exportConstName: "DEFAULT_PRODUCT_CLOUDS" as const,
          clouds: DEFAULT_PRODUCT_CLOUDS,
          setClouds: () => {},
        },
        footer: {
          key: "footer" as const,
          label: "Footer clouds (FAQ)",
          exportConstName: "DEFAULT_FOOTER_CLOUDS" as const,
          clouds: DEFAULT_FOOTER_CLOUDS,
          setClouds: () => {},
        },
        productArea: {
          key: "productArea" as const,
          label: "Product-area clouds",
          exportConstName: "DEFAULT_PRODUCT_AREA_CLOUDS" as const,
          clouds: DEFAULT_PRODUCT_AREA_CLOUDS,
          setClouds: () => {},
        },
        landscape: {
          key: "landscape" as const,
          label: "Landscape / CTA clouds",
          exportConstName: "DEFAULT_LANDSCAPE_CLOUDS" as const,
          clouds: DEFAULT_LANDSCAPE_CLOUDS,
          setClouds: () => {},
        },
        siteFooter: {
          key: "siteFooter" as const,
          label: "Site footer clouds (about/privacy/terms)",
          exportConstName: "DEFAULT_SITE_FOOTER_CLOUDS" as const,
          clouds: DEFAULT_SITE_FOOTER_CLOUDS,
          setClouds: () => {},
        },
        jobsFooter: {
          key: "jobsFooter" as const,
          label: "Jobs footer clouds",
          exportConstName: "DEFAULT_JOBS_FOOTER_CLOUDS" as const,
          clouds: DEFAULT_JOBS_FOOTER_CLOUDS,
          setClouds: () => {},
        },
      },
    };
  }
  return ctx;
};

/** Convenience hook for a single section. */
export const useCloudSection = (key: CloudSectionKey) => {
  const { sections, calibrate } = useClouds();
  return { ...sections[key], calibrate };
};
