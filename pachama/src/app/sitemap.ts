import type { MetadataRoute } from "next";

// One page: the story. lastModified is the build, which is when it last changed.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://pachama.alevizio.com/", lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
