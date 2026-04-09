import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db, blogPosts, users, blogCategories } from "@/db";
import { eq, desc, asc, and } from "drizzle-orm";
import Link from "next/link";
import BlogFilters from "./BlogFilters";

export default async function PublicBlogPage({ searchParams }: { searchParams: { category?: string, sort?: string } }) {
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
        <main className="bg-[#0A0A0A] min-h-screen flex flex-col">
            <Navbar />
            
            <section className="pt-40 pb-20 px-6 relative flex-1">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#4353FF]/5 blur-[150px] rounded-full pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="mb-12 text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="w-8 h-px bg-[#4353FF]" />
                            <span className="font-body font-bold text-[#4353FF] text-xs uppercase tracking-[0.2em]">Our News</span>
                            <div className="w-8 h-px bg-[#4353FF]" />
                        </div>
                        <h1 className="font-heading font-black text-white uppercase text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-tight mb-6">
                            Insights & Updates
                        </h1>
                        <p className="font-body text-gray-400 text-lg leading-relaxed">
                            Discover the latest strategies, case studies, and news from our team across design, engineering, and product growth.
                        </p>
                    </div>

                    <BlogFilters categories={categories} />

                    {posts.length === 0 ? (
                        <div className="py-24 text-center border border-white/5 bg-white/[0.02]">
                            <p className="font-heading font-bold text-white text-xl mb-2">No posts found</p>
                            <p className="font-body text-gray-500">Try adjusting your category filters.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map(({ post, author, category }) => (
                                <Link href={`/blog/${post.slug}`} key={post.id} className="group relative bg-[#111] border border-white/10 hover:border-[#4353FF]/50 transition-all duration-500 overflow-hidden flex flex-col">
                                    <div className="relative h-[240px] w-full overflow-hidden">
                                        <div className="absolute inset-0 bg-[#4353FF]/20 group-hover:bg-transparent transition-colors z-10" />
                                        {post.image ? (
                                            <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center font-heading text-gray-800 font-black text-4xl">NO IMAGE</div>
                                        )}
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="bg-black/60 backdrop-blur border border-white/10 text-white font-body text-[10px] uppercase tracking-widest px-3 py-1.5 font-bold">
                                                {category?.name || "General"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h2 className="font-heading font-bold text-white text-2xl leading-tight mb-4 group-hover:text-[#4353FF] transition-colors">{post.title}</h2>
                                        <p className="font-body text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                            {post.excerpt || post.content.substring(0, 150) + "..."}
                                        </p>
                                        <div className="flex items-center gap-3 pt-6 border-t border-white/10 mt-auto">
                                            <div className="w-10 h-10 rounded-full bg-[#4353FF]/20 border border-[#4353FF]/30 overflow-hidden flex items-center justify-center flex-shrink-0">
                                                {author?.avatar ? (
                                                    <img src={author.avatar} alt="Author" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="font-heading font-black text-[#4353FF] text-lg">{author?.name?.[0] || "?"}</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-heading font-bold text-white text-[13px]">{author?.name || "Unknown Author"}</p>
                                                <p className="font-body text-gray-500 text-[10px] uppercase tracking-widest mt-0.5">{new Date(post.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
