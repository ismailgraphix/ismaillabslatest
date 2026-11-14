import { db, blogPosts, users, blogCategories } from "@/db";
import { eq, desc, asc, and } from "drizzle-orm";
import Link from "next/link";
import NotesFilters from "./NotesFilters";
import SectionLabel from "@/components/SectionLabel";

export const metadata = {
    title: "Notes",
    description: "Short write-ups from real projects by Ismail Labs.",
};

export default async function NotesPage({ searchParams }: { searchParams: { category?: string, sort?: string } }) {
    // 1. Fetch available categories for the filter UI
    const categories = await db.select().from(blogCategories);

    // 2. Build where clause dynamically
    const conditions = [eq(blogPosts.published, true)];
    if (searchParams.category && searchParams.category !== "all") {
        conditions.push(eq(blogPosts.categoryId, searchParams.category));
    }

    // 3. Build order clause
    const orderClause = searchParams.sort === "oldest"
        ? asc(blogPosts.createdAt)
        : desc(blogPosts.createdAt);

    // 4. Fetch the posts
    const posts = await db
        .select({
            post: blogPosts,
            author: { name: users.name, avatar: users.avatar },
            category: { name: blogCategories.name }
        })
        .from(blogPosts)
        .leftJoin(users, eq(users.id, blogPosts.authorId))
        .leftJoin(blogCategories, eq(blogCategories.id, blogPosts.categoryId))
        .where(and(...conditions))
        .orderBy(orderClause);

    return (
        <main className="bg-[var(--app-bg)] min-h-screen flex flex-col">

            <section className="pt-40 pb-20 px-6 relative flex-1">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="mb-12 text-center max-w-3xl mx-auto">
                        <SectionLabel className="justify-center mb-6">Notes</SectionLabel>
                        <h1 className="font-heading font-bold text-[var(--text)] text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-tight mb-6">
                            Notes from real projects
                        </h1>
                        <p className="font-body text-[var(--muted)] text-lg leading-relaxed">
                            Short write-ups from the systems we build and maintain: what broke, what we changed and what we would do again.
                        </p>
                    </div>

                    <NotesFilters categories={categories} />

                    {posts.length === 0 ? (
                        <div className="py-24 text-center border border-[var(--border)] bg-[var(--surface)] rounded-lg">
                            <p className="font-heading font-bold text-[var(--text)] text-xl mb-2">No notes found</p>
                            <p className="font-body text-[var(--muted)]">Try adjusting your category filters.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map(({ post, author, category }) => (
                                <Link href={`/notes/${post.slug}`} key={post.id} className="group relative bg-[var(--surface)] border border-[var(--border)] hover:border-accent/40 transition-colors duration-[120ms] overflow-hidden flex flex-col rounded-lg">
                                    <div className="relative h-[240px] w-full overflow-hidden bg-[var(--chip-bg)]">
                                        {post.image ? (
                                            <img src={post.image} alt="" className="w-full h-full object-cover transition-transform duration-[120ms] ease-in group-hover:scale-[1.03] group-hover:duration-[240ms] group-hover:ease-[cubic-bezier(0.2,0,0,1)]" />
                                        ) : (
                                            <div className="w-full h-full bg-accent/[0.06]" aria-hidden="true" />
                                        )}
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] font-mono text-[11px] uppercase tracking-[0.1em] px-2.5 py-1.5 rounded">
                                                {category?.name || "General"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h2 className="font-heading font-bold text-[var(--text)] text-2xl leading-tight tracking-tight mb-4 group-hover:text-[var(--accent-text)] transition-colors">{post.title}</h2>
                                        <p className="font-body text-[var(--muted)] text-[15px] leading-relaxed mb-6 flex-1 line-clamp-3">
                                            {post.excerpt || post.content.substring(0, 150) + "..."}
                                        </p>
                                        <div className="flex items-center gap-3 pt-6 border-t border-[var(--border)] mt-auto">
                                            <div className="w-10 h-10 rounded-md bg-accent/10 border border-accent/25 overflow-hidden flex items-center justify-center flex-shrink-0">
                                                {author?.avatar ? (
                                                    <img src={author.avatar} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="font-heading font-bold text-[var(--accent-text)] text-lg">{author?.name?.[0] || "?"}</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-heading font-bold text-[var(--text)] text-[13px]">{author?.name || "Unknown Author"}</p>
                                                <p className="font-mono text-[var(--text-faint)] text-[11px] mt-0.5">{new Date(post.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

        </main>
    );
}
