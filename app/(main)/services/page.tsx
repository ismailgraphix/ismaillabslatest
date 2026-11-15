// app/(main)/services/page.tsx
// Every published service, with one sentence each and a link to its page.
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { unstable_noStore as noStore } from "next/cache";
import PageHeader from "@/components/PageHeader";
import { ServiceGrid } from "@/components/Services";
import DatabaseErrorModal from "@/components/DatabaseErrorModal";
import { getPublishedServices } from "@/lib/queries";

export const metadata: Metadata = pageMeta({
    title: "Services",
    description: "What Ismail Labs builds: web and mobile applications, SaaS products, APIs and the design and advice around them.",
    path: "/services",
});

export default async function ServicesPage() {
    noStore(); // admin edits must show immediately

    let services: Awaited<ReturnType<typeof getPublishedServices>> = [];
    let dbError: string | null = null;
    try {
        services = await getPublishedServices();
    } catch (err) {
        console.error("Services page fetch error:", err);
        dbError = "Failed to load services due to a database connection error.";
    }

    return (
        <main className="bg-[var(--app-bg)] min-h-screen">
            {dbError && <DatabaseErrorModal error={dbError} />}
            <PageHeader label="Services" title="What we build">
                <p>Pick a service to see what it covers.</p>
            </PageHeader>

            <section className="max-w-[1300px] mx-auto px-6 md:px-10 pb-24">
                {services.length > 0 && <ServiceGrid services={services} />}
            </section>
        </main>
    );
}
