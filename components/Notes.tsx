import Link from "next/link";
import { unstable_noStore as noStore } from 'next/cache';
import DatabaseErrorModal from "./DatabaseErrorModal";
import SectionLabel from "@/components/SectionLabel";
import { getLatestPosts, MIN_POSTS_TO_SHOW_NOTES } from "@/lib/queries";

export default async function Notes() {
  noStore();

  let posts: Awaited<ReturnType<typeof getLatestPosts>> = [];
  let dbError = null;

  try {
      posts = await getLatestPosts();
  } catch (err: any) {
      console.error("Notes section fetch error:", err);
      dbError = "Failed to load notes due to a database connection error.";
  }

  if (dbError) return <DatabaseErrorModal error={dbError} />;

  // The section stays off the home page until there are enough posts to fill it.
  if (posts.length < MIN_POSTS_TO_SHOW_NOTES) return null;

  return (
    <section id="notes" className="py-28 bg-[var(--app-bg)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel className="justify-center mb-4">From the work</SectionLabel>
          <h2 className="font-heading font-bold text-[clamp(2rem,4vw,3.25rem)] leading-tight tracking-tight text-[var(--text)]">
            Notes
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map(({ post, author, category }) => (
            <Link href={`/notes/${post.slug}`} key={post.id} className="group rounded-lg overflow-hidden border border-[var(--border)] hover:border-accent/40 transition-colors duration-300 cursor-pointer block bg-[var(--surface)]">
              <div className="relative aspect-video overflow-hidden bg-[var(--chip-bg)]">
                {post.image ? (
                  <img
                    src={post.image}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-accent/[0.06]" aria-hidden="true" />
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-accent text-white font-mono text-[11px] px-2.5 py-1.5 rounded uppercase tracking-[0.1em]">
                    {category?.name || "General"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 text-[var(--text-faint)] text-xs font-mono mb-4">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="w-1 h-1 bg-accent" />
                  <span>By {author?.name || "Admin"}</span>
                </div>

                <h3 className="font-heading font-bold text-[var(--text)] text-lg leading-snug mb-4 group-hover:text-[var(--accent-text)] transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <div className="flex items-center gap-2 font-body font-semibold text-sm text-[var(--accent-text)]">
                  Read note
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:translate-x-1 transition-transform">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/notes" className="inline-flex items-center justify-center rounded-md bg-accent text-white border border-accent font-body font-semibold px-8 py-4 text-sm hover:bg-[var(--text)] hover:border-[var(--text)] hover:text-[var(--app-bg)] transition-colors duration-300">
            All notes
          </Link>
        </div>
      </div>
    </section>
  );
}
