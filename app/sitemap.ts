import type { MetadataRoute } from "next";
import { fallbackManagedBlogs, fallbackManagedHomes } from "@/lib/content-store";
import { fetchManagedBlogs, fetchManagedHomes } from "@/lib/public-content";
import { SITE_URL } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, homes] = await Promise.all([
    fetchManagedBlogs().catch(fallbackManagedBlogs),
    fetchManagedHomes().catch(fallbackManagedHomes),
  ]);
  const updatedAt = new Date();
  const staticPages = [
    "",
    "/homes",
    "/flat-tour",
    "/blog",
    "/founder",
    "/happy-customers",
    "/amenities",
    "/location",
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: updatedAt,
      changeFrequency: path === "/blog" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.8,
    })),
    ...homes.map((property) => ({
      url: `${SITE_URL}/homes/${property.slug}`,
      lastModified: property.updatedAt ? new Date(property.updatedAt) : updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...blogs.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
