// app/(main)/about/page.tsx
// The studio and its founder. Replaces /portfolio, which redirects here.
// The founder section reads the profile edited at /admin/portfolio; every
// section that has nothing to show is left out.
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import PageHeader from "@/components/PageHeader";
import SectionLabel from "@/components/SectionLabel";
import DatabaseErrorModal from "@/components/DatabaseErrorModal";
import { getProfile } from "@/lib/queries";
import { site } from "@/lib/site";
import { unshout } from "@/lib/text";

export const metadata: Metadata = {
    title: "About",
    description: `${site.name} is a software studio in Abuja building systems for universities, hospitals and the teams that run them.`,
};

const sectionHeading = "font-heading font-bold text-[var(--text)] text-[clamp(1.6rem,2.8vw,2.4rem)] leading-tight tracking-tight";

export default async function AboutPage() {
    noStore(); // admin edits must show immediately

    let profile: Awaited<ReturnType<typeof getProfile>> = null;
    let dbError: string | null = null;
    try {
        profile = await getProfile();
    } catch (err) {
        console.error("About page fetch error:", err);
        dbError = "Failed to load the profile due to a database connection error.";
    }

    const hero = profile?.hero;
    const bio = site.founder.bio ?? hero?.description?.trim() ?? "";
    const role = hero?.title ? unshout(hero.title.trim()) : null;

    // Stack: the grouped list from lib/site.ts once it is filled in, otherwise
    // the skill names from the admin as one plain list (no levels, no bars).
    const adminStack = Array.from(
        new Set(
            [...(hero?.tags ?? []), ...(profile?.skills ?? []).map((s) => s.name), ...(profile?.otherSkills ?? [])]
                .map((name) => name?.trim())
                .filter((name): name is string => Boolean(name)),
        ),
    );
    const stackGroups = site.stackGroups.length > 0
        ? site.stackGroups
        : adminStack.length > 0
            ? [{ label: "", items: adminStack }]
            : [];

    const experiences = (profile?.experiences ?? []).filter((e) => e.role?.trim() || e.company?.trim());
    const education = (profile?.education ?? []).filter((e) => e.degree?.trim() || e.school?.trim());

    // "Download CV" only for a real PDF, never for an editable document link.
    const resumeUrl = hero?.resumeUrl?.trim() ?? "";
    const hasResumePdf = /\.pdf($|[?#])/i.test(resumeUrl);

    return (
        <main className="bg-[var(--app-bg)] min-h-screen">
            {dbError && <DatabaseErrorModal error={dbError} />}

            {/* ── The studio. Draft copy from the rebuild plan; Ismail confirms it. ── */}
            <PageHeader label="About" title={`About ${site.name}`}>
                <p>
                    {site.name} is a software studio in {site.location}. We build and maintain the systems
                    universities, hospitals and growing organisations run on: student portals, hospital records,
                    payments and the back-office tools behind them, for clients anywhere.
                </p>
            </PageHeader>

            {/* ── Founder ── */}
            {bio && (
                <section aria-labelledby="founder-heading" data-reveal className="max-w-[1300px] mx-auto px-6 md:px-10 py-16 border-t border-[var(--border)]">
                    <div className={`grid gap-12 ${hero?.image ? "lg:grid-cols-[1fr_380px]" : ""} items-start`}>
                        <div className="max-w-2xl">
                            <SectionLabel className="mb-4">Founder</SectionLabel>
                            <h2 id="founder-heading" className={sectionHeading}>{site.founder.name}</h2>
                            {role && <p className="mt-2 font-mono text-sm text-[var(--accent-text)]">{role}</p>}
                            <p className="mt-6 font-body text-[17px] leading-relaxed text-[var(--muted)] whitespace-pre-line">{bio}</p>
                            {hasResumePdf && (
                                <a
                                    href={resumeUrl}
                                    className="mt-8 inline-flex items-center gap-2 border border-[var(--text)] text-[var(--text)] font-body font-semibold px-6 py-3.5 rounded-md hover:bg-[var(--text)] hover:text-[var(--app-bg)] transition-colors duration-[120ms] text-sm"
                                >
                                    Download CV (PDF)
                                </a>
                            )}
                        </div>

                        {hero?.image && (
                            <div className="relative mx-auto w-full max-w-[380px]">
                                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-[var(--chip-bg)]">
                                    <img src={hero.image} alt={`Portrait of ${site.founder.name}`} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-b-lg" aria-hidden="true" />
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ── Stack, as plain grouped text ── */}
            {stackGroups.length > 0 && (
                <section aria-labelledby="stack-heading" data-reveal className="max-w-[1300px] mx-auto px-6 md:px-10 py-16 border-t border-[var(--border)]">
                    <SectionLabel className="mb-4">Stack</SectionLabel>
                    <h2 id="stack-heading" className={`${sectionHeading} mb-10`}>What we build with</h2>
                    <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {stackGroups.map((group) => (
                            <div key={group.label || "stack"} className={group.label ? "" : "sm:col-span-2 lg:col-span-4"}>
                                {group.label && (
                                    <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)] mb-3">{group.label}</dt>
                                )}
                                <dd className="font-mono text-[15px] leading-loose text-[var(--text)]">{group.items.join(" · ")}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}

            {/* ── Experience, only with entries ── */}
            {experiences.length > 0 && (
                <section aria-labelledby="experience-heading" data-reveal className="max-w-[1300px] mx-auto px-6 md:px-10 py-16 border-t border-[var(--border)]">
                    <SectionLabel className="mb-4">Experience</SectionLabel>
                    <h2 id="experience-heading" className={`${sectionHeading} mb-10`}>Work experience</h2>
                    <ol className="space-y-6">
                        {experiences.map((exp, i) => (
                            <li key={i} className="bg-[var(--surface)] p-7 rounded-lg border border-[var(--border)]">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                    <div>
                                        <h3 className="font-heading font-bold text-[var(--text)] text-lg">{exp.role}</h3>
                                        <p className="font-body text-[var(--accent-text)] text-sm font-semibold">{exp.company}</p>
                                    </div>
                                    {exp.period && (
                                        <span className="font-mono text-xs text-[var(--muted)] whitespace-nowrap">{exp.period}</span>
                                    )}
                                </div>
                                {exp.desc && <p className="font-body text-[var(--muted)] text-sm leading-relaxed">{exp.desc}</p>}
                                {(exp.tags ?? []).length > 0 && (
                                    <p className="mt-4 font-mono text-xs text-[var(--text-soft)]">{exp.tags.join(" · ")}</p>
                                )}
                            </li>
                        ))}
                    </ol>
                </section>
            )}

            {/* ── Education, only with entries ── */}
            {education.length > 0 && (
                <section aria-labelledby="education-heading" data-reveal className="max-w-[1300px] mx-auto px-6 md:px-10 py-16 border-t border-[var(--border)]">
                    <SectionLabel className="mb-4">Education</SectionLabel>
                    <h2 id="education-heading" className={`${sectionHeading} mb-10`}>Education</h2>
                    <ul className="grid md:grid-cols-2 gap-5">
                        {education.map((edu, i) => (
                            <li key={i} className="bg-[var(--surface)] p-7 rounded-lg border border-[var(--border)]">
                                <h3 className="font-heading font-bold text-[var(--text)] text-lg mb-1">{edu.degree}</h3>
                                <p className="font-body text-[var(--accent-text)] text-sm font-semibold mb-3">{edu.school}</p>
                                <p className="font-mono text-xs text-[var(--muted)]">
                                    {[edu.period, edu.grade].filter(Boolean).join(" · ")}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <div className="pb-8" />
        </main>
    );
}
