import { db, services } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { unstable_noStore as noStore } from 'next/cache';
import SectionLabel from "@/components/SectionLabel";
import type { Metadata } from "next";
import { firstSentence } from "@/lib/text";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";

async function getService(slug: string) {
    const [service] = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
    return service && service.published ? service : null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    noStore();
    const service = await getService(params.slug).catch(() => null);
    if (!service) return {};
    return pageMeta({
        title: service.title,
        description: firstSentence(service.description) || `${service.title} from Ismail Labs.`,
        path: `/services/${service.slug}`,
    });
}

export default async function ServiceDetailsPage({ params }: { params: { slug: string } }) {
    noStore(); // Explicitly opt out of Next.js caching

    const service = await getService(params.slug);
    if (!service) return notFound();

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
            <JsonLd data={breadcrumbJsonLd([{ name: "Services", path: "/services" }, { name: service.title, path: `/services/${service.slug}` }])} />

            <article className="pt-32 pb-20 flex-1 relative">
                {/* Hero Header */}
                <div className="max-w-4xl mx-auto px-6 text-center mb-16 relative z-10">
                    <Link href="/services" className="inline-flex items-center gap-2 font-mono text-xs text-[var(--muted)] uppercase tracking-[0.14em] mb-8 hover:text-[var(--accent-text)] transition-colors">
                        ← Back to services
                    </Link>
                    <SectionLabel className="justify-center mb-6">Service</SectionLabel>
                    <div className="flex items-center justify-center mb-8 text-accent">
                        {service.icon ? (
                            <div className="w-16 h-16 [&_svg]:w-full [&_svg]:h-full" dangerouslySetInnerHTML={{ __html: service.icon }} />
                        ) : null}
                    </div>
                    <h1 className="font-heading font-bold text-[var(--text)] text-[clamp(2.25rem,4.5vw,4rem)] leading-[1.05] tracking-tight mb-8">
                        {service.title}
                    </h1>
                    <p className="font-body text-[var(--muted)] text-lg max-w-2xl mx-auto leading-relaxed">
                        {service.description}
                    </p>
                </div>

                {/* Hero Image */}
                {service.image && (
                    <div className="w-full max-w-5xl mx-auto px-6 mb-20 relative">
                        <div className="w-full h-[300px] md:h-[450px] rounded-lg overflow-hidden relative border border-[var(--border)] bg-[var(--chip-bg)]">
                            <Image src={service.image} alt="" fill sizes="(min-width: 1024px) 976px, 100vw" className="object-cover" />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="max-w-3xl mx-auto px-6 relative z-10">
                    <div className={proseArticle}>
                        <ReactMarkdown>{service.content || ""}</ReactMarkdown>
                    </div>

                    <div className="mt-20 pt-16 border-t border-[var(--border)] text-center">
                        <h2 className="font-heading font-bold text-[var(--text)] text-3xl tracking-tight mb-6">Tell us what you need built</h2>
                        <Link href="/contact" className="btn-wipe inline-flex items-center gap-3 bg-accent text-white border border-accent font-body font-semibold px-8 py-4 rounded-md hover:border-[var(--text)] hover:text-[var(--app-bg)] text-[15px]">
                            Start a project
                        </Link>
                    </div>
                </div>
            </article>


        </main>
    );
}
