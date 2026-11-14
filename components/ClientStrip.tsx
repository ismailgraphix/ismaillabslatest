// components/ClientStrip.tsx
// Names of institutions served, from lib/site.ts. Only names that have agreed
// to be listed go there, and the strip stays hidden until there are three.
import { site } from "@/lib/site";

const MIN_CLIENTS_TO_SHOW = 3;

export default function ClientStrip() {
    if (site.clients.length < MIN_CLIENTS_TO_SHOW) return null;

    return (
        <section aria-labelledby="clients-heading" className="bg-[var(--app-bg)] border-y border-[var(--border)]">
            <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
                <h2 id="clients-heading" className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)] shrink-0">
                    Built for
                </h2>
                <ul className="flex flex-wrap items-center gap-x-10 gap-y-3">
                    {site.clients.map((name) => (
                        <li key={name} className="font-heading font-medium text-[var(--text-soft)] text-lg">
                            {name}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
