// app/(main)/privacy/page.tsx
// DRAFT for Ismail to review (with legal advice if needed). It describes what
// the code actually collects as of the Phase 3 rebuild. Bracketed items need a
// real answer. The page returns 404 until `legalReviewed` in lib/site.ts is true.
import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
    title: "Privacy",
    description: `How ${site.name} handles information collected through this website.`,
};

export default function PrivacyPage() {
    return (
        <LegalPage title="Privacy" updated="[DATE OF REVIEW]">
            <p>
                This page explains what {site.name} collects through www.ismaillabs.com, why, and what you can ask us
                to do with it. {site.name} is based in {site.location}. Questions go to{" "}
                <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>

            <h2>When you send us a message</h2>
            <p>
                The contact form sends us your name, email address, organisation (if you give one), the kind of work
                you need, your timeline and your message. We also store the IP address the message came from, to help
                us spot spam. We use this only to reply to you and to discuss the work you asked about.
            </p>

            <h2>Visits to the site</h2>
            <p>
                When you open the home page or the About page, we record the page, the time, your IP address, your
                browser&apos;s user agent, the page that linked you here and the country your IP address belongs to.
                To find the country, your IP address is sent to the ip-api.com lookup service. We use these records
                to count visits. Other pages are not recorded.
            </p>

            <h2>Cookies and storage</h2>
            <p>
                Public visitors get no tracking or advertising cookies. If you switch between the light and dark
                themes, your choice is kept in your browser&apos;s local storage. A sign-in cookie is set only for
                people who log in to the site&apos;s admin area.
            </p>

            <h2>Who else handles the data</h2>
            <ul>
                <li>Vercel hosts the website.</li>
                <li>Neon hosts the database where messages and visit records are stored.</li>
                <li>Cloudinary hosts the images shown on the site.</li>
                <li>ip-api.com looks up the country for a visit, as described above.</li>
            </ul>

            <h2>How long we keep it</h2>
            <p>[RETENTION PERIOD for messages and for visit records.]</p>

            <h2>Your choices</h2>
            <p>
                You can ask us what we hold about you, ask us to correct it, or ask us to delete it, by emailing{" "}
                <a href={`mailto:${site.email}`}>{site.email}</a>. [CONFIRM the applicable law, for example the
                Nigeria Data Protection Act 2023, and any registration it requires.]
            </p>
        </LegalPage>
    );
}
