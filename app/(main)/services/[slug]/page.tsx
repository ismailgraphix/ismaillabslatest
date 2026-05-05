import { db, services } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default async function ServiceDetailsPage({ params }: { params: { slug: string } }) {
    const [service] = await db
        .select()
        .from(services)
        .where(eq(services.slug, params.slug))
        .limit(1);

    if (!service || !service.published) return notFound();

    const proseArticle =
        "font-body text-gray-600 text-lg leading-relaxed prose prose-neutral max-w-none " +
        "prose-p:mb-6 prose-headings:font-heading prose-headings:text-[#0f0f0f] prose-h2:font-black prose-h2:text-3xl prose-h2:uppercase prose-h2:mt-12 prose-h2:mb-6 " +
        "prose-h3:font-heading prose-h3:font-bold prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 " +
        "prose-a:text-[#4353FF] hover:prose-a:text-[#2f3ecc] prose-a:transition-colors " +
        "prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-li:mb-2 " +
        "prose-blockquote:border-l-4 prose-blockquote:border-[#4353FF] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-500 " +
        "prose-img:rounded-md prose-img:border prose-img:border-gray-200";

    return (
        <main className="bg-[#EBEBEB] min-h-screen flex flex-col">

            <article className="pt-32 pb-20 flex-1 relative">
                {/* Hero Header */}
                <div className="max-w-4xl mx-auto px-6 text-center mb-16 relative z-10">
                    <Link href="/#services" className="inline-flex items-center gap-2 font-body text-[11px] text-[#4353FF] uppercase tracking-widest font-bold mb-8 hover:text-[#0f0f0f] transition-colors">
                        ← Back to Services
                    </Link>
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="font-body font-bold text-gray-500 text-xs uppercase tracking-widest">Our Expertise</span>
                    </div>
                    <div className="flex items-center justify-center mb-8 text-[#4353FF]">
                        {service.icon ? (
                            <div className="w-16 h-16 [&_svg]:w-full [&_svg]:h-full" dangerouslySetInnerHTML={{ __html: service.icon }} />
                        ) : null}
                    </div>
                    <h1 className="font-heading font-black text-[#0f0f0f] uppercase text-[clamp(2.5rem,4vw,4.5rem)] leading-tight tracking-tight mb-8">
                        {service.title}
                    </h1>
                    <p className="font-body text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                        {service.description}
                    </p>
                </div>

                {/* Hero Image */}
                {service.image && (
                    <div className="w-full max-w-5xl mx-auto px-6 mb-20 relative">
                        <div className="w-full h-[300px] md:h-[450px] rounded-sm overflow-hidden relative border border-gray-200 shadow-lg bg-gray-100">
                            <div className="absolute inset-0 bg-[#4353FF]/5 z-10 mix-blend-multiply pointer-events-none" />
                            <img src={service.image} alt={service.title} className="w-full h-full object-cover relative z-0" />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="max-w-3xl mx-auto px-6 relative z-10">
                    <div className={proseArticle}>
                        <ReactMarkdown>{service.content || ""}</ReactMarkdown>
                    </div>

                    <div className="mt-20 pt-16 border-t border-gray-200 text-center">
                        <h3 className="font-heading font-black text-[#0f0f0f] text-3xl uppercase tracking-tight mb-6">Ready to get started?</h3>
                        <Link href="/#contact" className="inline-flex items-center gap-3 bg-[#4353FF] text-white font-body font-semibold px-8 py-5 hover:bg-[#0f0f0f] transition-all duration-300 text-sm uppercase tracking-widest">
                            Contact Us Today
                        </Link>
                    </div>
                </div>
            </article>


        </main>
    );
}
