// app/(main)/colophon/page.tsx
// "How this site is built": the short note the footer's build line links to.
// Everything here describes the code in this repository; update it when the
// stack changes.
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import { legalProse } from "@/components/LegalPage";

export const metadata: Metadata = pageMeta({
    title: "How this site is built",
    description: "The stack, data and measurements behind the Ismail Labs website.",
    path: "/colophon",
});

const stack = [
    { label: "Framework", value: "Next.js 14 (App Router), React 18, TypeScript" },
    { label: "Styling", value: "Tailwind CSS, with the brand colours as CSS variables for the light and dark themes" },
    { label: "Type", value: "Space Grotesk, Inter and JetBrains Mono, self-hosted through next/font" },
    { label: "Content", value: "An admin area built into the site; projects, services and notes are database records" },
    { label: "Data", value: "PostgreSQL on Neon, queried with Drizzle ORM" },
    { label: "Images", value: "Cloudinary" },
    { label: "Hosting", value: "Vercel" },
];

export default function ColophonPage() {
    return (
        <main className="bg-[var(--app-bg)] min-h-screen">
            <PageHeader label="Colophon" title="How this site is built">
                <p>The site is part of the pitch, so here is what it runs on and how the numbers in the footer are made.</p>
            </PageHeader>

            <div className="max-w-[1300px] mx-auto px-6 md:px-10 pb-24 grid gap-14 lg:grid-cols-[1fr_1fr]">
                <dl className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
                    {stack.map((row) => (
                        <div key={row.label} className="grid grid-cols-[120px_1fr] gap-6 py-4">
                            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)] pt-0.5">{row.label}</dt>
                            <dd className="font-body text-[15px] text-[var(--text)]">{row.value}</dd>
                        </div>
                    ))}
                </dl>

                <div className={legalProse}>
                    <h2 className="!mt-0">The footer line</h2>
                    <p>
                        The JavaScript figure is measured in your browser: it adds up the compressed size of every
                        script this visit has downloaded. The build date and the commit come from the build itself.
                        None of these numbers is typed by hand.
                    </p>
                    <h2>The demo on the home page</h2>
                    <p>
                        The customers, requests and payments views are working React components fed by a
                        small file of invented records. No client data is involved. The demo loads after the rest of
                        the page, and its guided tour does not play if your system asks for reduced motion.
                    </p>
                    <h2>Shortcuts</h2>
                    <p>
                        Press <kbd>Ctrl</kbd> + <kbd>K</kbd> (<kbd>⌘</kbd> + <kbd>K</kbd> on a Mac) or <kbd>/</kbd> to
                        open the command menu: jump to any page or project, copy the email address or switch theme.
                    </p>
                </div>
            </div>
        </main>
    );
}
