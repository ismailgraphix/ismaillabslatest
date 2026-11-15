// app/(main)/page.tsx
// Home, work first: positioning, who we have built for, the work itself, then
// services, process, client quotes, notes, and the contact call to action
// (which is the footer banner, shared with every page but /contact).
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import JsonLd from "@/components/JsonLd";
import { organizationJsonLd, pageMeta } from "@/lib/seo";
import Hero from "@/components/Hero";
import ClientStrip from "@/components/ClientStrip";
import SelectedWork from "@/components/SelectedWork";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Notes from "@/components/Notes";
import DatabaseErrorModal from "@/components/DatabaseErrorModal";
import SectionIndex from "@/components/SectionIndex";
import { getPublishedServices, getWork, hasEnoughPosts, type WorkItem } from "@/lib/queries";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMeta({
    description:
        "We build the software universities and hospitals run on: student portals, hospital records, payments and the systems behind them.",
    path: "/",
});

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

    const showNotes = await hasEnoughPosts();
    // The section index lists only the sections that are on the page.
    const sections = [
        { id: "home", label: "Intro" },
        ...(work.length > 0 ? [{ id: "work", label: "Work" }] : []),
        ...(services.length > 0 ? [{ id: "services", label: "What we build" }] : []),
        { id: "process", label: "How a project runs" },
        ...(site.testimonials.length >= 2 ? [{ id: "testimonials", label: "From clients" }] : []),
        ...(showNotes ? [{ id: "notes", label: "Notes" }] : []),
    ];

    return (
        <main>
            <JsonLd data={organizationJsonLd()} />
            <SectionIndex sections={sections} />
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
