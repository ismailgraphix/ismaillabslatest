import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import DatabaseErrorModal from "@/components/DatabaseErrorModal";
import { db, services } from "@/db";
import { eq, asc } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export default async function Home() {
    let servicesData: any[] = [];
    let dbError = null;

    try {
        servicesData = await db
            .select({
                id: services.id,
                title: services.title,
                slug: services.slug,
                icon: services.icon,
                image: services.image
            })
            .from(services)
            .where(eq(services.published, true))
            .orderBy(asc(services.order))
            .limit(4);
    } catch (err: any) {
        console.error("Home page Services fetch error:", err);
        dbError = "Failed to load services due to a database connection error.";
    }

    return (
        <main>
            {dbError && <DatabaseErrorModal error={dbError} />}
            <Navbar />
            <Hero />

            <About />
            <Services services={servicesData} />
            <Portfolio />
            <Process />
            <Testimonials />
            <Blog />
            <Contact />

        </main>
    );
}