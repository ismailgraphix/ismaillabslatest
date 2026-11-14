// components/Services.tsx
// "What we build": each published service with one sentence and a link.
// The home page shows this section; /services uses the same grid.
import Link from "next/link";
import SectionLabel from "@/components/SectionLabel";
import { firstSentence } from "@/lib/text";

export interface ServiceSummary {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    icon: string | null;
}

/** The service cards on their own, for pages that supply their own heading. */
export function ServiceGrid({ services }: { services: ServiceSummary[] }) {
    return (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[var(--border)] rounded-lg overflow-hidden" data-reveal-list>
            {services.map((s, i) => (
                <li key={s.id} className="border-r border-b border-[var(--border)]">
                    <Link
                        href={`/services/${s.slug}`}
                        className="group relative flex h-full flex-col p-7 hover:bg-[var(--surface)] transition-colors duration-[120ms]"
                    >
                        <div className="mb-6 flex items-start justify-between gap-4">
                            {/* Icon SVG as entered in the admin */}
                            <div className="w-10 h-10 text-accent [&_svg]:w-full [&_svg]:h-full" aria-hidden="true">
                                {s.icon ? (
                                    <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: s.icon }} />
                                ) : (
                                    <div className="w-full h-full border-2 border-accent/30 rounded-md" />
                                )}
                            </div>
                            <span className="font-mono text-xs text-[var(--text-faint)] tabular-nums" aria-hidden="true">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                        </div>

                        <h3 className="font-heading font-bold text-[var(--text)] text-lg leading-snug mb-3 group-hover:text-[var(--accent-text)] transition-colors duration-[120ms]">
                            {s.title}
                        </h3>
                        <p className="font-body text-[15px] leading-relaxed text-[var(--muted)] mb-6">
                            {firstSentence(s.description)}
                        </p>

                        <span className="mt-auto inline-flex items-center gap-2 font-body font-semibold text-sm text-[var(--accent-text)]">
                            What it covers
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="group-hover:translate-x-1 transition-transform">
                                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>

                        <span className="absolute bottom-0 left-0 h-[3px] w-full bg-accent origin-left scale-x-0 transition-transform duration-[120ms] ease-in group-hover:scale-x-100 group-hover:duration-[240ms] group-hover:ease-[cubic-bezier(0.2,0,0,1)] group-focus-visible:scale-x-100" aria-hidden="true" />
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default function Services({ services = [] }: { services?: ServiceSummary[] }) {
    if (services.length === 0) return null;

    return (
        <section id="services" className="bg-[var(--app-bg)] py-24">
            <div className="max-w-[1300px] mx-auto px-6 md:px-10">
                <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6" data-reveal>
                    <div className="max-w-2xl">
                        <SectionLabel className="mb-5">Services</SectionLabel>
                        <h2 className="font-heading font-bold text-[2.6rem] leading-[1.02] tracking-[-0.03em] sm:text-[3.4rem] text-[var(--text)]">
                            What we build
                        </h2>
                    </div>
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 self-start md:self-auto rounded-md border border-[var(--text)] text-[var(--text)] font-body font-semibold px-6 py-3.5 text-sm hover:border-accent hover:text-[var(--accent-text)] transition-colors duration-[120ms]"
                    >
                        All services
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>

                <ServiceGrid services={services} />
            </div>
        </section>
    );
}
