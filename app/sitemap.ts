import { MetadataRoute } from "next";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://edunexus.arundigi.in";

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/teachers`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/institutes`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/buses`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    // Dynamic job vacancies
    const jobs = await db
      .select({
        id: schema.jobVacancies.id,
        updatedAt: schema.jobVacancies.updatedAt,
      })
      .from(schema.jobVacancies)
      .where(eq(schema.jobVacancies.status, "published"))
      .limit(100);

    const jobRoutes: MetadataRoute.Sitemap = jobs.map((j) => ({
      url: `${baseUrl}/jobs/${j.id}`,
      lastModified: j.updatedAt ? new Date(j.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Dynamic institutes
    const institutes = await db
      .select({
        slug: schema.institutes.slug,
        updatedAt: schema.institutes.updatedAt,
      })
      .from(schema.institutes)
      .limit(100);

    const instituteRoutes: MetadataRoute.Sitemap = institutes.map((i) => ({
      url: `${baseUrl}/institutes/${i.slug}`,
      lastModified: i.updatedAt ? new Date(i.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    }));

    return [...staticRoutes, ...jobRoutes, ...instituteRoutes];
  } catch {
    // Fallback if db query fails during build
    return staticRoutes;
  }
}
