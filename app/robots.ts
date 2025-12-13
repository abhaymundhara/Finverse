import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://weneed.money/sitemap.xml",
    host: "https://weneed.money",
  };
}
