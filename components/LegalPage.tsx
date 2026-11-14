// components/LegalPage.tsx
// Shared layout for /privacy and /terms. Both are drafts: they 404 until
// `legalReviewed` in lib/site.ts is set to true after review.
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { site } from "@/lib/site";

export const legalProse =
    "font-body text-[var(--muted)] text-[17px] leading-relaxed prose prose-neutral max-w-none " +
    "prose-headings:font-heading prose-headings:text-[var(--text)] prose-headings:tracking-tight prose-h2:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 " +
    "prose-strong:text-[var(--text)] prose-a:text-[var(--accent-text)] hover:prose-a:text-[var(--text)] " +
    "prose-ul:list-[square] prose-ul:pl-6 prose-li:mb-2 marker:text-accent";

export default function LegalPage({
    title,
    updated,
    children,
}: {
    title: string;
    /** Date of the last review, written out, for example "14 November 2026". */
    updated: string;
    children: React.ReactNode;
}) {
    if (!site.legalReviewed) notFound();

    return (
        <main className="bg-[var(--app-bg)] min-h-screen">
            <PageHeader label="Legal" title={title}>
                <p className="font-mono text-sm">Last updated {updated}</p>
            </PageHeader>
            <div className="max-w-[1300px] mx-auto px-6 md:px-10 pb-24">
                <div className={`max-w-3xl ${legalProse}`}>{children}</div>
            </div>
        </main>
    );
}
