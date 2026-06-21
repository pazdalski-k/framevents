import type { MetadataRoute } from "next";
import { supabase } from "./lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = "https://www.framevents.fr";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const { data: events, error } = await supabase
    .from("events")
    .select("id, date")
    .eq("is_published", true)
    .order("date", { ascending: false });

  if (error) {
    console.log("SITEMAP EVENTS ERROR:", error);
    return staticRoutes;
  }

  const eventRoutes: MetadataRoute.Sitemap =
    events?.map((event) => ({
      url: `${siteUrl}/event/${event.id}`,
      lastModified: event.date ? new Date(event.date) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })) || [];

  return [...staticRoutes, ...eventRoutes];
}