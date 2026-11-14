// components/SelectedWork.tsx
// Home page: the first three published projects. Hidden when there are none.
import Link from "next/link";
import SectionLabel from "@/components/SectionLabel";
import WorkCard from "@/components/WorkCard";
import type { WorkItem } from "@/lib/queries";

export default function SelectedWork({ work }: { work: WorkItem[] }) {
    if (work.length === 0) return null;
    const selected = work.slice(0, 3);

    return (
        <section id="work" className="bg-[var(--app-bg)] py-24">
            <div className="max-w-[1300px] mx-auto px-6 md:px-10">
                <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div className="max-w-2xl">
                        <SectionLabel className="mb-5">Work</SectionLabel>
                        <h2 className="font-heading font-bold text-[2.6rem] leading-[1.02] tracking-[-0.03em] sm:text-[3.4rem] text-[var(--text)]">
                            Selected work
                        </h2>
                    </div>
                    {work.length > selected.length && (
                        <Link
                            href="/work"
                            className="inline-flex items-center gap-2 self-start md:self-auto rounded-md border border-[var(--text)] text-[var(--text)] font-body font-semibold px-6 py-3.5 text-sm hover:border-accent hover:text-[var(--accent-text)] transition-colors duration-300"
                        >
                            All work ({work.length})
                        </Link>
                    )}
                </div>

                <ul className={`grid gap-6 md:grid-cols-2 ${selected.length >= 3 ? "lg:grid-cols-3" : ""}`}>
                    {selected.map((project) => (
                        <li key={project.id}>
                            <WorkCard project={project} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
