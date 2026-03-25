import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://glyph.calyvent.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-03-25"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/scan`,
      lastModified: new Date("2026-03-25"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date("2026-03-25"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
