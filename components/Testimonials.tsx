// components/Testimonials.tsx
// "From clients": real quotes from lib/site.ts, used with permission. The
// section stays off the page until there are at least two. Quotes reveal with
// the shared section motion (data-reveal; components/RevealObserver.tsx).
import { site } from "@/lib/site";
import SectionLabel from "@/components/SectionLabel";

const MIN_QUOTES = 2;

export default function Testimonials() {
    const quotes = site.testimonials;
    if (quotes.length < MIN_QUOTES) return null;

    return (
        <section id="testimonials" className="bg-[var(--app-bg)] py-24">
            <div className="max-w-[1300px] mx-auto px-6 md:px-10">
                <div className="mb-12" data-reveal>
                    <SectionLabel className="mb-5">Testimonials</SectionLabel>
                    <h2 className="font-heading font-bold text-[2.6rem] leading-[1.02] tracking-[-0.03em] sm:text-[3.4rem] text-[var(--text)]">
                        From clients
                    </h2>
                </div>

                <ul className={`grid gap-6 ${quotes.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`} data-reveal-list>
                    {quotes.map((t) => (
                        <li key={`${t.name}-${t.organisation}`}>
                            <figure className="h-full flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-8">
                                <span className="mb-6 h-2 w-2 bg-accent" aria-hidden="true" />
                                <blockquote className="flex-1 font-body text-base leading-relaxed text-[var(--text)]">
                                    <p>&ldquo;{t.quote}&rdquo;</p>
                                </blockquote>
                                <figcaption className="mt-8">
                                    <p className="font-heading font-bold text-[15px] text-[var(--text)]">{t.name}</p>
                                    <p className="font-body text-sm text-[var(--muted)] mt-0.5">
                                        {t.role}, {t.organisation}
                                    </p>
                                </figcaption>
                            </figure>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
