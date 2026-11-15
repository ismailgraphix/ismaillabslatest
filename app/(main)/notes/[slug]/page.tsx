// app/(main)/notes/[slug]/page.tsx
// One note. Published posts only; a draft or unknown slug is a 404.
import Image from "next/image";
import type { Metadata } from "next";
import { db, blogPosts, users, blogCategories } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { unstable_noStore as noStore } from "next/cache";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, articleJsonLd, breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { firstSentence } from "@/lib/text";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
    const [data] = await db
        .select({
            post: blogPosts,
            author: { name: users.name, avatar: users.avatar },
            category: { name: blogCategories.name },
        })
        .from(blogPosts)
        .leftJoin(users, eq(users.id, blogPosts.authorId))
        .leftJoin(blogCategories, eq(blogCategories.id, blogPosts.categoryId))
        .where(eq(blogPosts.slug, slug))
        .limit(1);
    return data && data.post.published ? data : null;
}

function describe(post: { excerpt: string | null; content: string | null; title: string }) {
    return firstSentence(post.excerpt) || firstSentence(post.content) || post.title;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    noStore();
    const data = await getPost(params.slug).catch(() => null);
    if (!data) return {};
    const { post } = data;
    return pageMeta({
        title: post.title,
        description: describe(post),
        path: `/notes/${post.slug}`,
        type: "article",
        image: post.image ? { url: post.image, alt: post.title } : null,
        publishedTime: post.createdAt.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
    });
}

export default async function NotePage({ params }: { params: { slug: string } }) {
    noStore(); // admin edits must show immediately

    const data = await getPost(params.slug);
    if (!data) return notFound();
    const { post, author, category } = data;
    const path = `/notes/${post.slug}`;
    const url = encodeURIComponent(absoluteUrl(path));
    const text = encodeURIComponent(post.title);
    const shareLinks = [
        { label: "X", href: `https://twitter.com/intent/tweet?url=${url}&text=${text}` },
        { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
        { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    ];

    const proseArticle =
        "font-body text-[var(--muted)] text-[17px] leading-relaxed prose prose-neutral max-w-none " +
        "prose-p:mb-6 prose-headings:font-heading prose-headings:text-[var(--text)] prose-headings:tracking-tight prose-h2:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 " +
        "prose-h3:font-bold prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 " +
        "prose-strong:text-[var(--text)] " +
        "prose-a:text-[var(--accent-text)] hover:prose-a:text-[var(--text)] prose-a:transition-colors " +
        "prose-ul:list-[square] prose-ul:pl-6 prose-ul:mb-6 prose-li:mb-2 marker:text-accent " +
        "prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[var(--muted)] " +
        "prose-img:rounded-md prose-img:border prose-img:border-[var(--border)]";

    return (
        <main className="bg-[var(--app-bg)] min-h-screen flex flex-col">
            <JsonLd
                data={[
                    articleJsonLd({
                        title: post.title,
                        description: describe(post),
                        path,
                        image: post.image,
                        author: author?.name,
                        published: post.createdAt,
                        modified: post.updatedAt,
                    }),
                    breadcrumbJsonLd([{ name: "Notes", path: "/notes" }, { name: post.title, path }]),
                ]}
            />

            <article className="pt-32 pb-20 flex-1 relative">
                {/* Hero Header */}
                <div className="max-w-4xl mx-auto px-6 text-center mb-16 relative z-10">
                    <Link href="/notes" className="inline-flex items-center gap-2 font-mono text-xs text-[var(--muted)] uppercase tracking-[0.14em] mb-8 hover:text-[var(--accent-text)] transition-colors">
                        ← Back to notes
                    </Link>
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="font-mono text-[var(--muted)] text-xs uppercase tracking-[0.14em]">{category?.name || "General"}</span>
                        <div className="w-1.5 h-1.5 bg-accent" />
                        <span className="font-mono text-[var(--muted)] text-xs uppercase tracking-[0.14em]"><time dateTime={post.createdAt.toISOString()}>{post.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time></span>
                    </div>
                    <h1 className="font-heading font-bold text-[var(--text)] text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] tracking-tight mb-10">
                        {post.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-md bg-accent/10 border border-accent/25 overflow-hidden flex items-center justify-center">
                            {author?.avatar ? (
                                <Image src={author.avatar} alt="" width={48} height={48} className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-heading font-bold text-[var(--accent-text)] text-xl">{author?.name?.[0] || "?"}</span>
                            )}
                        </div>
                        <div className="text-left">
                            <p className="font-heading font-bold text-[var(--text)] text-sm">{author?.name || "Unknown Author"}</p>
                            <p className="font-mono text-[var(--muted)] text-[11px] uppercase tracking-[0.14em] mt-0.5">Editor</p>
                        </div>
                    </div>
                </div>

                {/* Hero Image */}
                {post.image && (
                    <div className="w-full max-w-6xl mx-auto px-6 mb-16">
                        <div className="w-full h-[300px] md:h-[500px] rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--chip-bg)] relative">
                            <Image src={post.image} alt="" fill priority sizes="(min-width: 1152px) 1104px, 100vw" className="object-cover" />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="max-w-3xl mx-auto px-6 relative z-10">
                    <div className={proseArticle}>
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>

                    <div className="mt-20 pt-10 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <span className="font-mono text-[var(--text)] text-xs uppercase tracking-[0.14em]">Share</span>
                            <ul className="flex items-center gap-5">
                                {shareLinks.map((l) => (
                                    <li key={l.label}>
                                        <a
                                            href={l.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-body text-sm text-[var(--muted)] hover:text-[var(--accent-text)] transition-colors duration-[120ms]"
                                        >
                                            {l.label}
                                            <span className="sr-only"> (opens in a new tab)</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </article>


        </main>
    );
}
