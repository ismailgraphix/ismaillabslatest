// app/(main)/contact/page.tsx
// The brief form beside direct contact details. Phone and reply time come from
// lib/site.ts and stay hidden until they are supplied.
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { unstable_noStore as noStore } from "next/cache";
import { Clock, Mail, Phone } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import { getPublishedServices } from "@/lib/queries";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
    title: "Contact",
    description: `Tell ${site.name} what you need built.`,
    path: "/contact",
});

export default async function ContactPage() {
    noStore(); // the "what you need" list follows the published services

    // The form still works without the service list: it falls back to "Something else".
    let needs: string[] = [];
    try {
        needs = (await getPublishedServices()).map((s) => s.title);
    } catch (err) {
        console.error("Contact page services fetch error:", err);
    }

    const details = [
        { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
        ...(site.phone
            ? [{ icon: Phone, label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/[^+\d]/g, "")}` }]
            : []),
        ...(site.replyTime ? [{ icon: Clock, label: "Reply time", value: `We reply ${site.replyTime}.`, href: null }] : []),
    ];

    return (
        <main className="bg-[var(--app-bg)] min-h-screen">
            <PageHeader label="Contact" title="Tell us what you need built">
                <p>Describe the system, who will use it and what exists today. We reply by email.</p>
            </PageHeader>

            <div className="max-w-[1300px] mx-auto px-6 md:px-10 pb-24 grid gap-12 lg:grid-cols-[1fr_360px] items-start">
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 md:p-8">
                    <ContactForm needs={needs} />
                </div>

                <aside aria-labelledby="direct-contact-heading" className="lg:sticky lg:top-28">
                    <h2 id="direct-contact-heading" className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)] mb-6">
                        Direct contact
                    </h2>
                    <ul className="space-y-6">
                        {details.map((item) => (
                            <li key={item.label} className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-accent rounded-md flex items-center justify-center flex-shrink-0 text-white" aria-hidden="true">
                                    <item.icon size={18} strokeWidth={2.2} />
                                </div>
                                <div>
                                    <p className="font-mono text-[var(--muted)] text-[11px] uppercase tracking-[0.14em] mb-0.5">{item.label}</p>
                                    {item.href ? (
                                        <a href={item.href} className="font-body text-[var(--text)] text-[15px] hover:text-[var(--accent-text)] transition-colors">
                                            {item.value}
                                        </a>
                                    ) : (
                                        <p className="font-body text-[var(--text)] text-[15px]">{item.value}</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </main>
    );
}
