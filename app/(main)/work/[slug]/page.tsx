// app/(main)/work/[slug]/page.tsx
// One project. It shows the fields the projects table has today: title, type,
// year, description, stack, screenshots and live link. The fuller case-study
// fields (client, sector, role, problem, result, quote) arrive with the
// migration in db/pending/0001_case_study_fields.sql, which has not been applied.
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import SectionLabel from "@/components/SectionLabel";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { getWork } from "@/lib/queries";
import { firstSentence } from "@/lib/text";
import { getImageSize } from "@/lib/image-size";
import { SHARED_NAME } from "@/lib/view-transition-name";

async function getProject(slug: string) {
    const work = await getWork();
    return work.find((project) => project.slug === slug) ?? null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    noStore();
    const project = await getProject(params.slug).catch(() => null);
    if (!project) return {};
    // Shared links show the project's own screenshot.
    return pageMeta({
        title: project.title,
        description: firstSentence(project.description) || `${project.title}, built by Ismail Labs.`,
        path: `/work/${project.slug}`,
        image: project.image ? { url: project.image, alt: `Screenshot of ${project.title}` } : null,
    });
}

export default async function WorkDetailPage({ params }: { params: { slug: string } }) {
    noStore(); // admin edits must show immediately

    const project = await getProject(params.slug);
    if (!project) return notFound();

    const paragraphs = project.description.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    const sources = [project.image, project.image3d].filter((src): src is string => Boolean(src));
    // Real pixel sizes, so each screenshot keeps its whole height and its space is
    // reserved before it loads. 16:10 is the fallback if the size is unavailable.
    const screenshots = await Promise.all(
        sources.map(async (src) => ({ src, size: (await getImageSize(src)) ?? { width: 1600, height: 1000 } })),
    );
    const facts = [
        { label: "Type", value: project.typeLabel },
        { label: "Year", value: String(project.year) },
    ];

    return (
        <main className="bg-[var(--app-bg)] min-h-screen">
            <JsonLd data={breadcrumbJsonLd([{ name: "Work", path: "/work" }, { name: project.title, path: `/work/${project.slug}` }])} />
            <article className="max-w-[1300px] mx-auto px-6 md:px-10 pt-36 pb-24">
                <Link
                    href="/work"
                    className="inline-flex items-center gap-2 font-mono text-xs text-[var(--muted)] uppercase tracking-[0.14em] mb-10 hover:text-[var(--accent-text)] transition-colors"
                >
                    ← All work
                </Link>

                <header className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-end mb-14">
                    <div>
                        <SectionLabel className="mb-6">{project.typeLabel}</SectionLabel>
                        <h1 className="font-heading font-bold text-[var(--text)] text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] tracking-[-0.03em]">
                            {project.title}
                        </h1>
                    </div>

                    <dl className="grid grid-cols-2 gap-6 border-t border-[var(--border)] pt-6">
                        {facts.map((fact) => (
                            <div key={fact.label}>
                                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)] mb-1">{fact.label}</dt>
                                <dd className="font-body text-[var(--text)]">{fact.value}</dd>
                            </div>
                        ))}
                    </dl>
                </header>

                {screenshots[0] && (
                    <figure className="mb-16 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--chip-bg)]">
                        {/* Named for the shared-element transition from the work card (lib/view-transition.tsx). */}
                        <Image
                            src={screenshots[0].src}
                            alt={`Screenshot of ${project.title}`}
                            width={screenshots[0].size.width}
                            height={screenshots[0].size.height}
                            priority
                            sizes="(min-width: 1300px) 1220px, calc(100vw - 48px)"
                            className="w-full h-auto"
                            style={{ viewTransitionName: SHARED_NAME }}
                        />
                    </figure>
                )}

                <div className="grid gap-14 lg:grid-cols-[1fr_320px]">
                    <div className="max-w-2xl space-y-6 font-body text-[17px] leading-relaxed text-[var(--muted)]">
                        <h2 className="font-heading font-bold text-[var(--text)] text-2xl tracking-tight">About the project</h2>
                        {paragraphs.map((paragraph, i) => (
                            <p key={i} className="whitespace-pre-line">{paragraph}</p>
                        ))}
                    </div>

                    <aside className="space-y-10">
                        {project.techStack.length > 0 && (
                            <div>
                                <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)] mb-4">Stack</h2>
                                <ul className="space-y-2 font-mono text-sm text-[var(--text)]">
                                    {project.techStack.map((tech) => (
                                        <li key={tech} className="flex items-center gap-3">
                                            <span className="h-1.5 w-1.5 bg-accent shrink-0" aria-hidden="true" />
                                            {tech}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {project.link && (
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-wipe inline-flex items-center gap-2.5 bg-accent text-white font-body font-semibold text-sm px-6 py-3.5 rounded-md border border-accent hover:border-[var(--text)] hover:text-[var(--app-bg)]"
                            >
                                Visit the live site
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="btn-arrow">
                                    <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="sr-only">(opens in a new tab)</span>
                            </a>
                        )}
                    </aside>
                </div>

                {screenshots.length > 1 && (
                    <div className="mt-16 grid gap-6 md:grid-cols-2">
                        {screenshots.slice(1).map(({ src, size }) => (
                            <figure key={src} className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--chip-bg)]">
                                <Image
                                    src={src}
                                    alt={`Another screen from ${project.title}`}
                                    width={size.width}
                                    height={size.height}
                                    sizes="(min-width: 768px) 600px, calc(100vw - 48px)"
                                    className="w-full h-auto"
                                />
                            </figure>
                        ))}
                    </div>
                )}
            </article>
        </main>
    );
}
