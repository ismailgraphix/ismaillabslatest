// components/WorkCard.tsx
// One case-study card: type label, title, one line, screenshot, link.
// Used by the home page's selected work and by /work.
import { TransitionLink } from "@/lib/view-transition";
import type { WorkItem } from "@/lib/queries";
import { firstSentence } from "@/lib/text";

export default function WorkCard({ project, headingLevel = "h3" }: { project: WorkItem; headingLevel?: "h2" | "h3" }) {
    const Heading = headingLevel;

    return (
        // The screenshot morphs into the project page's header image where the browser supports it.
        <TransitionLink
            href={`/work/${project.slug}`}
            sharedSelector="[data-shared-image]"
            className="group flex h-full flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-accent/40 transition-colors duration-[240ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
            <div className="relative aspect-[16/10] overflow-hidden bg-[var(--chip-bg)] border-b border-[var(--border)]">
                {project.image ? (
                    <img
                        data-shared-image
                        src={project.image}
                        alt={`Screenshot of ${project.title}`}
                        loading="lazy"
                        className="w-full h-full object-cover object-top transition-transform duration-[120ms] ease-in group-hover:scale-[1.03] group-hover:duration-[240ms] group-hover:ease-[cubic-bezier(0.2,0,0,1)] group-focus-visible:scale-[1.03]"
                    />
                ) : (
                    <div className="w-full h-full bg-accent/[0.06]" aria-hidden="true" />
                )}
                {/* Hover or focus: an accent square appears in the corner */}
                <span
                    aria-hidden="true"
                    className="absolute top-4 right-4 h-3 w-3 bg-accent opacity-0 scale-50 transition-[opacity,transform] duration-[120ms] ease-in group-hover:opacity-100 group-hover:scale-100 group-hover:duration-[240ms] group-hover:ease-[cubic-bezier(0.2,0,0,1)] group-focus-visible:opacity-100 group-focus-visible:scale-100"
                />
            </div>

            <div className="flex flex-1 flex-col p-6 md:p-7">
                <p className="mb-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    <span>{project.typeLabel}</span>
                    <span className="h-1 w-1 bg-accent" aria-hidden="true" />
                    <span className="tabular-nums">{project.year}</span>
                </p>
                <Heading className="font-heading font-bold text-[var(--text)] text-xl leading-snug mb-3 group-hover:text-[var(--accent-text)] transition-colors duration-[120ms]">
                    {project.title}
                    {/* Hover or focus: an underline grows from the left */}
                    <span
                        aria-hidden="true"
                        className="mt-1 block h-[2px] w-12 bg-accent origin-left scale-x-0 transition-transform duration-[120ms] ease-in group-hover:scale-x-100 group-hover:duration-[240ms] group-hover:ease-[cubic-bezier(0.2,0,0,1)] group-focus-visible:scale-x-100"
                    />
                </Heading>
                <p className="font-body text-[15px] leading-relaxed text-[var(--muted)] mb-6">
                    {firstSentence(project.description)}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 font-body font-semibold text-sm text-[var(--accent-text)]">
                    View project
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="group-hover:translate-x-1 transition-transform">
                        <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </div>
        </TransitionLink>
    );
}
