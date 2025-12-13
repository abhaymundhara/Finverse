import type { MetadataRoute } from "next";

const baseUrl = "https://weneed.money";

const calculatorSlugs = [
  "fire",
  "goal-sip",
  "nps",
  "hra",
  "rd",
  "nsc",
  "ssy",
  "cagr",
  "irr",
  "mf",
  "savings-runway",
  "net-worth",
  "sip",
  "fd",
  "debt-payoff",
  "emergency-fund",
  "affordability",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...calculatorSlugs.map((slug) => ({
      url: `${baseUrl}/calculators/${slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
  ];
}
