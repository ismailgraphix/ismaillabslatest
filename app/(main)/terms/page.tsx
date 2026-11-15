// app/(main)/terms/page.tsx
// DRAFT for Ismail to review (with legal advice if needed). These are terms for
// using the website, not a contract for client work, which is agreed in writing
// per project. Bracketed items need a real answer. The page returns 404 until
// `legalReviewed` in lib/site.ts is true.
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import LegalPage from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
    title: "Terms",
    description: `Terms for using the ${site.name} website.`,
    path: "/terms",
});

export default function TermsPage() {
    return (
        <LegalPage title="Terms" updated="[DATE OF REVIEW]">
            <p>
                These terms cover your use of www.ismaillabs.com, run by {site.name}. By using the
                site you accept them. They do not cover client projects: each project is governed by its own written
                agreement.
            </p>

            <h2>Content on this site</h2>
            <p>
                The text, design and code of this site belong to {site.name} unless stated otherwise. Screenshots and
                names of client work appear with the client&apos;s permission and remain theirs. You may link to any
                page; please ask before copying content.
            </p>

            <h2>Accuracy</h2>
            <p>
                We keep the information here accurate, but it is general information about our work and not an offer.
                Scope, timelines and prices are agreed in writing for each project.
            </p>

            <h2>Links to other sites</h2>
            <p>Links to live client systems and other sites are provided for reference. We are not responsible for their content.</p>

            <h2>Messages you send</h2>
            <p>
                Do not send passwords, customer records, personal data or other confidential information through the contact
                form. We will arrange a secure channel if a project needs it. See the <a href="/privacy">privacy page</a>{" "}
                for how messages are handled.
            </p>

            <h2>Governing law</h2>
            <p>[CONFIRM: these terms are governed by the laws of the Federal Republic of Nigeria.]</p>

            <h2>Changes</h2>
            <p>
                We may update these terms. The date at the top shows the latest version. Questions go to{" "}
                <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
        </LegalPage>
    );
}
