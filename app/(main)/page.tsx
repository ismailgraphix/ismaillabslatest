// app/(main)/page.tsx
// Home, work first: positioning, who we have built for, the work itself, then
// services, process, client quotes, notes, and the contact call to action
// (which is the footer banner, shared with every page but /contact).
import { unstable_noStore as noStore } from "next/cache";
import Hero from "@/components/Hero";
import ClientStrip from "@/components/ClientStrip";
import SelectedWork from "@/components/SelectedWork";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Notes from "@/components/Notes";
import DatabaseErrorModal from "@/components/DatabaseErrorModal";
import { getPublishedServices, getWork, type WorkItem } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
    noStore(); // admin edits must show immediately; called outside the try (see lib/queries.ts)

    let services: Awaited<ReturnType<typeof getPublishedServices>> = [];
    let work: WorkItem[] = [];
    let dbError: string | null = null;

    try {
        [services, work] = await Promise.all([getPublishedServices(), getWork()]);
    } catch (err) {
        console.error("Home page fetch error:", err);
        dbError = "Failed to load the page content due to a database connection error.";
    }

    return (
        <main>
            {dbError && <DatabaseErrorModal error={dbError} />}
            <Hero />
            {/* Each section below renders nothing until it has real content. */}
            <ClientStrip />
            <SelectedWork work={work} />
            <Services services={services} />
            <Process />
            <Testimonials />
            <Notes />
        </main>
    );
}
