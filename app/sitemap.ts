// app/sitemap.ts
// /sitemap.xml, built from the public routes and the published records:
// case studies, services and notes. Drafts never appear. The legal pages are
// listed only once they are live (site.legalReviewed). If the database cannot
// be reached, the static pages are still listed.
import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { db, blogPosts } from "@/db";
import { getPublishedServices, getWork } from "@/lib/queries";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

// Rebuilt at most once an hour.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticPaths = ["/", "/work", "/services", "/about", "/notes", "/contact", "/colophon"];
    if (site.legalReviewed) staticPaths.push("/privacy", "/terms");

    const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
        url: absoluteUrl(path),
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : 0.7,
    }));

    try {
        const [work, services, posts] = await Promise.all([
            getWork(),
            getPublishedServices(),
            db
                .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
                .from(blogPosts)
                .where(eq(blogPosts.published, true)),
        ]);
        for (const w of work) entries.push({ url: absoluteUrl(`/work/${w.slug}`), changeFrequency: "monthly", priority: 0.8 });
        for (const s of services) entries.push({ url: absoluteUrl(`/services/${s.slug}`), changeFrequency: "monthly", priority: 0.6 });
        for (const p of posts) entries.push({ url: absoluteUrl(`/notes/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "yearly", priority: 0.5 });
    } catch (err) {
        console.error("[sitemap] database unavailable; listing static pages only", err);
    }

    return entries;
}
