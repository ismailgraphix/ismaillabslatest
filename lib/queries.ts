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
import { db, services, blogPosts, users, blogCategories } from "@/db";
import { eq, asc, desc } from "drizzle-orm";

/** The home blog section and the Blog links stay hidden below this many published posts. */
export const MIN_POSTS_TO_SHOW_BLOG = 3;

/** Published services in display order. Used by the home page cards and the footer list. */
export const getPublishedServices = cache(async () => {
    return db
        .select({
            id: services.id,
            title: services.title,
            slug: services.slug,
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

/** Whether there are enough published posts to show the blog. Never throws: a database error counts as "no". */
export async function hasEnoughPosts(): Promise<boolean> {
    noStore(); // admin edits must show immediately; see the note at the top of this file
    try {
        return (await getLatestPosts()).length >= MIN_POSTS_TO_SHOW_BLOG;
    } catch {
        return false;
    }
}
