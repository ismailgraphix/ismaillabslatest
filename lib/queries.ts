// lib/queries.ts
// Read queries shared by the public layout and pages. Each is wrapped in
// React's cache(), so the header, the footer and the page can all ask for the
// same data during one request and the database is queried once.
//
// Callers must call noStore() themselves, BEFORE any try/catch around these
// queries. During a build, noStore() opts a route out of static rendering by
// throwing, and a catch block that swallows that throw hides it from Next.js.
import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { db, services, blogPosts, users, blogCategories, projects, personalPortfolio } from "@/db";
import { eq, asc, desc } from "drizzle-orm";

/** The home notes section and the Notes links stay hidden below this many published posts. */
export const MIN_POSTS_TO_SHOW_NOTES = 3;

/** Published services in display order. Used by the home page, the services page and the footer. */
export const getPublishedServices = cache(async () => {
    return db
        .select({
            id: services.id,
            title: services.title,
            slug: services.slug,
            description: services.description,
            icon: services.icon,
            image: services.image,
        })
        .from(services)
        .where(eq(services.published, true))
        .orderBy(asc(services.order), asc(services.createdAt));
});

/** The three most recent published posts, with author and category names. */
export const getLatestPosts = cache(async () => {
    return db
        .select({
            post: blogPosts,
            author: { name: users.name },
            category: { name: blogCategories.name },
        })
        .from(blogPosts)
        .leftJoin(users, eq(users.id, blogPosts.authorId))
        .leftJoin(blogCategories, eq(blogCategories.id, blogPosts.categoryId))
        .where(eq(blogPosts.published, true))
        .orderBy(desc(blogPosts.createdAt))
        .limit(3);
});

/** Whether there are enough published posts to show notes. Never throws: a database error counts as "no". */
export async function hasEnoughPosts(): Promise<boolean> {
    noStore(); // admin edits must show immediately; see the note at the top of this file
    try {
        return (await getLatestPosts()).length >= MIN_POSTS_TO_SHOW_NOTES;
    } catch {
        return false;
    }
}

// ── Work ───────────────────────────────────────────────────────────────────
// Case studies are built on the existing `projects` table. That table has no
// slug column yet, so the URL slug is derived from the title here. The SQL in
// db/pending/0001_case_study_fields.sql adds a real slug column (filled with
// this same rule) and the other case-study fields; it has not been applied.

/** "Pathtern (AI Internship Matcher)" -> "pathtern-ai-internship-matcher". Keep in step with the SQL backfill. */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

const WORK_TYPE_LABELS: Record<string, string> = {
    web: "Web application",
    landing: "Landing page",
    mobile_app: "Mobile app",
};

/** Published projects, most prominent first, each with its URL slug, a readable type and its year. */
export const getWork = cache(async () => {
    const rows = await db
        .select()
        .from(projects)
        .where(eq(projects.published, true))
        .orderBy(desc(projects.order), desc(projects.createdAt));

    // Two titles can reduce to the same slug; later ones get "-2", "-3", ...
    // so every project keeps a working URL.
    const seen = new Map<string, number>();
    return rows.map((project) => {
        const base = slugify(project.title) || "project";
        const count = (seen.get(base) ?? 0) + 1;
        seen.set(base, count);
        return {
            ...project,
            description: project.description ?? "",
            techStack: project.techStack ?? [],
            slug: count === 1 ? base : `${base}-${count}`,
            typeLabel: WORK_TYPE_LABELS[project.type] ?? project.type,
            year: new Date(project.createdAt).getFullYear(),
        };
    });
});

export type WorkItem = Awaited<ReturnType<typeof getWork>>[number];

// ── About ──────────────────────────────────────────────────────────────────

/** The single profile record edited at /admin/portfolio, or null when there is none. */
export const getProfile = cache(async (): Promise<typeof personalPortfolio.$inferSelect | null> => {
    const [profile] = await db.select().from(personalPortfolio).limit(1);
    return profile ?? null;
});
