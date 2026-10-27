import type { MetadataRoute } from "next";

// Open to every crawler, search and AI alike, the same as alevizio.com.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://pachama.alevizio.com/sitemap.xml",
  };
}
