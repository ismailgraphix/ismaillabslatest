import { db, blogPosts, users, blogCategories } from "@/db";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { unstable_noStore as noStore } from 'next/cache';
import DatabaseErrorModal from "./DatabaseErrorModal";

export default async function Blog() {
  noStore();
  
  let posts: any[] = [];
  let dbError = null;

  try {
      posts = await db
          .select({
              post: blogPosts,
              author: { name: users.name },
              category: { name: blogCategories.name }
          })
          .from(blogPosts)
          .leftJoin(users, eq(users.id, blogPosts.authorId))
          .leftJoin(blogCategories, eq(blogCategories.id, blogPosts.categoryId))
          .where(eq(blogPosts.published, true))
          .orderBy(desc(blogPosts.createdAt))
          .limit(3);
  } catch (err: any) {
      console.error("Blog component fetch error:", err);
      dbError = "Failed to load blog posts due to a database connection error.";
  }

  return (
    <section className="py-28 bg-white">
      {dbError && <DatabaseErrorModal error={dbError} />}
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#4A6CF7]/10 rounded-full px-4 py-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A6CF7]" />
            <span className="font-heading font-semibold text-sm text-[#4A6CF7] uppercase tracking-widest">News & Latest Updates</span>
          </div>
          <h2 className="font-heading font-black text-[clamp(2rem,4vw,3.5rem)] leading-tight text-[#0A0A0A]">
            Check Our Company Inside Story
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map(({ post, author, category }) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 cursor-pointer block bg-white">
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-[#f1f1f1] flex items-center justify-center font-heading text-gray-300 font-black text-2xl">NO IMAGE</div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-[#4A6CF7] text-white font-heading font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {category?.name || "General"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 text-gray-400 text-xs font-body mb-4">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>By {author?.name || "Admin"}</span>
                </div>

                <h3 className="font-heading font-black text-[#0A0A0A] text-lg leading-snug mb-4 group-hover:text-[#4A6CF7] transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#4A6CF7]">
                  Read More
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:translate-x-1 transition-transform">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/blog" className="inline-flex items-center justify-center bg-[#4A6CF7] text-white font-heading font-black px-8 py-4 uppercase tracking-wider text-sm hover:bg-[#0A0A0A] hover:-translate-y-1 transition-all duration-300">
            View All News
          </Link>
        </div>
      </div>
    </section>
  );
}
