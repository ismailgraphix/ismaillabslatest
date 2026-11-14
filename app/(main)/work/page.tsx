// app/(main)/work/page.tsx
// Every published project, built on the existing projects table.
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import PageHeader from "@/components/PageHeader";
import WorkCard from "@/components/WorkCard";
import DatabaseErrorModal from "@/components/DatabaseErrorModal";
import { getWork, type WorkItem } from "@/lib/queries";

export const metadata: Metadata = {
    title: "Work",
    description: "Systems Ismail Labs has designed, built and shipped.",
};

export default async function WorkPage() {
    noStore(); // admin edits must show immediately

    let work: WorkItem[] = [];
    let dbError: string | null = null;
    try {
        work = await getWork();
    } catch (err) {
        console.error("Work page fetch error:", err);
        dbError = "Failed to load projects due to a database connection error.";
    }

    return (
        <main className="bg-[var(--app-bg)] min-h-screen">
            {dbError && <DatabaseErrorModal error={dbError} />}
            <PageHeader label="Work" title="What we have built">
                <p>Products and sites we have designed, built and shipped, with the stack behind each one.</p>
            </PageHeader>

            <section className="max-w-[1300px] mx-auto px-6 md:px-10 pb-24">
                {work.length === 0 ? (
                    <p className="py-24 text-center border border-[var(--border)] bg-[var(--surface)] rounded-lg font-body text-[var(--muted)]">
                        Projects will be listed here soon.
                    </p>
                ) : (
                    <ul className="grid gap-6 md:grid-cols-2">
                        {work.map((project) => (
                            <li key={project.id}>
                                <WorkCard project={project} headingLevel="h2" />
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}
