import Hero from "@/components/Hero";

import About from "@/components/About";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import DatabaseErrorModal from "@/components/DatabaseErrorModal";
import { getPublishedServices } from "@/lib/queries";

export const dynamic = 'force-dynamic';

import { unstable_noStore as noStore } from 'next/cache';

export default async function Home() {
    noStore(); // Explicitly opt out of Next.js caching for this entire page

    let servicesData: Awaited<ReturnType<typeof getPublishedServices>> = [];
    let dbError = null;

    try {
        // We show 4 by default in UI, with a "View all" toggle.
        // Fetching all here keeps it simple and avoids adding a separate page/API.
        // The footer reads the same list, so the query is shared (see lib/queries.ts).
        servicesData = await getPublishedServices();
    } catch (err: any) {
        console.error("Home page Services fetch error:", err);
        dbError = "Failed to load services due to a database connection error.";
    }

    return (
        <main>
            {dbError && <DatabaseErrorModal error={dbError} />}
            <Hero />

            <About />
            <Services services={servicesData} />
            <Process />
            {/* Testimonials and Blog render nothing until there is real content for them. */}
            <Testimonials />
            <Blog />
            <Contact />

        </main>
    );
}
