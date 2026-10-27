import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

/* The same GA4 property as alevizio.com, so the case studies sit next to the
 * home page in one report. Every page view here carries a content group, so
 * the Pages report can split the story out from the home page's "/" (switch
 * its dimension to Content group, or add Hostname). Production only: previews
 * and local dev would otherwise count as visits. */
const GA_ID = "G-JRVRY4MMLZ";

export function SiteAnalytics({ group }: { group: string }) {
  const live = process.env.VERCEL_ENV === "production";
  return (
    <>
      {live ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{content_group:${JSON.stringify(group)}});`}
          </Script>
        </>
      ) : null}
      <Analytics />
    </>
  );
}
