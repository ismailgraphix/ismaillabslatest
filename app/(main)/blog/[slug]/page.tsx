import { db, blogPosts, users, blogCategories } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const [data] = await db
        .select({
            post: blogPosts,
            author: { name: users.name, avatar: users.avatar },
            category: { name: blogCategories.name }
        })
        .from(blogPosts)
        .leftJoin(users, eq(users.id, blogPosts.authorId))
        .leftJoin(blogCategories, eq(blogCategories.id, blogPosts.categoryId))
        .where(eq(blogPosts.slug, params.slug))
        .limit(1);

    if (!data || !data.post.published) return notFound();
    const { post, author, category } = data;

    return (
        <main className="bg-[#0A0A0A] min-h-screen flex flex-col">


            <article className="pt-32 pb-20 flex-1 relative">
                {/* Hero Header */}
                <div className="max-w-4xl mx-auto px-6 text-center mb-16 relative z-10">
                    <Link href="/blog" className="inline-flex items-center gap-2 font-body text-[11px] text-[#4353FF] uppercase tracking-widest font-bold mb-8 hover:text-white transition-colors">
                        ← Back to News
                    </Link>
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="font-body font-bold text-gray-400 text-xs uppercase tracking-widest">{category?.name || "General"}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4353FF]" />
                        <span className="font-body font-medium text-gray-400 text-xs uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h1 className="font-heading font-black text-white uppercase text-[clamp(2rem,4vw,4rem)] leading-tight tracking-tight mb-10">
                        {post.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#4353FF]/20 border border-[#4353FF]/30 overflow-hidden flex items-center justify-center">
                            {author?.avatar ? (
                                <img src={author.avatar} alt="Author" className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-heading font-black text-[#4353FF] text-xl">{author?.name?.[0] || "?"}</span>
                            )}
                        </div>
                        <div className="text-left">
                            <p className="font-heading font-bold text-white text-sm">{author?.name || "Unknown Author"}</p>
                            <p className="font-body text-[#4353FF] text-[10px] uppercase tracking-widest mt-0.5">Editor</p>
                        </div>
                    </div>
                </div>

                {/* Hero Image */}
                {post.image && (
                    <div className="w-full max-w-6xl mx-auto px-6 mb-16">
                        <div className="w-full h-[300px] md:h-[500px] rounded-sm overflow-hidden border border-white/10 relative">
                            <div className="absolute inset-0 bg-[#4353FF]/10 z-10 mix-blend-color" />
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="max-w-3xl mx-auto px-6 relative z-10">
                    <div className="font-body text-gray-300 text-lg leading-relaxed prose prose-invert prose-p:mb-6 prose-h2:font-heading prose-h2:font-black prose-h2:text-white prose-h2:text-3xl prose-h2:uppercase prose-h2:mt-12 prose-h2:mb-6 prose-h3:font-heading prose-h3:font-bold prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-a:text-[#4353FF] hover:prose-a:text-white prose-a:transition-colors prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-li:mb-2 prose-blockquote:border-l-4 prose-blockquote:border-[#4353FF] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-400 prose-img:rounded-md prose-img:border prose-img:border-white/10 max-w-none">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>

                    <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex gap-4">
                            <span className="font-body font-semibold text-white text-sm uppercase tracking-widest">Share —</span>
                            <button className="text-gray-500 hover:text-[#4353FF] transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg></button>
                            <button className="text-gray-500 hover:text-[#4353FF] transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-3 7h-1.924c-.615 0-1.076.252-1.076.889v1.111h3l-.239 3h-2.761v8h-3v-8h-2v-3h2v-1.923c0-2.022 1.064-3.077 3.461-3.077h2.539v3z" /></svg></button>
                            <button className="text-gray-500 hover:text-[#4353FF] transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg></button>
                        </div>
                    </div>
                </div>
            </article>


        </main>
    );
}
