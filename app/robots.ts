import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = "https://www.framevents.fr";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/event/",
          "/privacy",
          "/terms",
        ],
        disallow: [
          "/admin",
          "/admin/",
          "/api",
          "/api/",
          "/checkout",
          "/cart",
          "/download",
          "/success",
          "/cancel",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}