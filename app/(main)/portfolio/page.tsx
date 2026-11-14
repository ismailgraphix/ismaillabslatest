"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(true);

    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") {
            setInView(true);
            return;
        }

        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setInView(true); },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
}

function ProjectCard({ p, i, inView }: { p: any, i: number, inView: boolean }) {
    const className = `group relative overflow-hidden bg-gray-100 block transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`;
    const style = { transitionDelay: `${i * 100}ms` };

    const body = (
        <>
            <div className="aspect-[16/10] overflow-hidden">
                <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                <span className="font-body text-xs text-[#4353FF] bg-[#4353FF]/20 backdrop-blur-sm px-2.5 py-1 mb-2 inline-block font-semibold">{p.type}</span>
                <h3 className="font-heading font-black text-white text-xl">{p.title}</h3>
                <p className="font-body text-white/70 text-sm mt-1">{p.description}</p>
            </div>

            {/* Year badge */}
            <div className="absolute top-4 right-4 font-body text-xs font-bold text-white bg-[#0f0f0f]/60 backdrop-blur-sm px-2.5 py-1">
                {p.createdAt ? p.createdAt.substring(0, 4) : new Date().getFullYear()}
            </div>

            {/* Arrow: only on cards that link somewhere */}
            {p.link && (
                <div className="absolute top-4 left-4 w-9 h-9 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 12L12 2M12 2H4M12 2v8" stroke="#0f0f0f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            )}
        </>
    );

    // A project without a live URL is a plain card, not a link to "#".
    return p.link ? (
        <a href={p.link} className={className} style={style}>{body}</a>
    ) : (
        <div className={className} style={style}>{body}</div>
    );
}

export default function PortfolioPage() {
    const [loaded, setLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState("All");
    const heroRef = useInView(0.1);
    const skillsRef = useInView(0.1);
    const expRef = useInView(0.1);
    const projRef = useInView(0.1);
    const eduRef = useInView(0.1);
    const ctaRef = useInView(0.1);

    const [cfg, setCfg] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        setTimeout(() => setLoaded(true), 80);
        const timestamp = new Date().getTime();

        // Guard against stuck body-lock from other overlays/navs.
        document.body.style.overflow = "";

        fetch(`/api/personal-portfolio?t=${timestamp}`, { cache: 'no-store' })
            .then(r => r.json())
            .then(d => {
                const safe = d || {};
                setCfg({
                    ...safe,
                    hero: safe.hero || {},
                    skills: Array.isArray(safe.skills) ? safe.skills : [],
                    otherSkills: Array.isArray(safe.otherSkills) ? safe.otherSkills : [],
                    experiences: Array.isArray(safe.experiences) ? safe.experiences : [],
                    education: Array.isArray(safe.education) ? safe.education : [],
                });
            });
        fetch(`/api/projects?t=${timestamp}`, { cache: 'no-store' })
            .then(r => r.json())
            .then(d => setProjects(d.items || []));

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    // The sections only exist once the data has loaded, so a link such as
    // /portfolio#work has nothing to scroll to on arrival. Do it here, once.
    const scrolledToHash = useRef(false);
    useEffect(() => {
        if (scrolledToHash.current || !cfg) return;
        const id = window.location.hash.slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        scrolledToHash.current = true;
        target.scrollIntoView();
    }, [cfg, projects.length]);

    const tabs = ["All", ...Array.from(new Set<string>(projects.map(p => p.type).filter(Boolean)))];
    const filtered = activeTab === "All" ? projects : projects.filter(p => p.type === activeTab);
    const validSkills = (cfg?.skills || []).filter((s: any) => (s?.name || "").trim().length > 0);
    const validExperiences = (cfg?.experiences || []).filter((e: any) =>
        (e?.role || "").trim() ||
        (e?.company || "").trim() ||
        (e?.period || "").trim() ||
        (e?.desc || "").trim() ||
        ((e?.tags || []).length > 0)
    );
    const validEducation = (cfg?.education || []).filter((e: any) =>
        (e?.degree || "").trim() ||
        (e?.school || "").trim() ||
        (e?.period || "").trim() ||
        (e?.grade || "").trim()
    );

    if (!cfg) return <div className="min-h-screen bg-[var(--app-bg)] flex items-center justify-center font-body text-[var(--text)]">Loading...</div>;

    // Title words exactly as entered in the admin; the second word takes the accent colour.
    const [word1, word2, ...restWords] = (cfg.hero?.title || site.name).trim().split(/\s+/);
    const word3 = restWords.join(" ");

    // "Download CV" only shows for a real PDF link, never for an editable document.
    const resumeUrl = (cfg.hero?.resumeUrl || "").trim();
    const hasResumePdf = /\.pdf($|[?#])/i.test(resumeUrl);

    const otherSkills: string[] = cfg.otherSkills || [];

    return (
        <main className="bg-[var(--app-bg)] min-h-screen font-body">

            {/* ── HERO ── */}
            <section id="about" className="min-h-screen flex items-center pt-24 pb-16 relative overflow-hidden" ref={heroRef.ref}>
                {/* Ghost circle */}
                <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#4353FF]/10 pointer-events-none" />
                <div className="absolute right-[0%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#4353FF]/10 pointer-events-none" />

                <div className="max-w-[1300px] mx-auto px-6 md:px-10 w-full grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left */}
                    <div>
                        <div className={`transition-all duration-700 delay-100 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                            <div className="inline-flex items-center gap-2 bg-[#4353FF]/10 px-4 py-2 mb-6">
                                <span className="w-2 h-2 rounded-full bg-[#4353FF] animate-pulse" />
                                <span className="font-body text-xs font-semibold text-[#4353FF] uppercase tracking-widest">Available for work</span>
                            </div>
                        </div>

                        <div className={`transition-all duration-700 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                            <h1 className="font-heading font-black text-[var(--text)] uppercase leading-[0.9] tracking-tight mb-6"
                                style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}>
                                {word1}
                                {word2 && <><br /><span className="text-[#4353FF]">{word2}</span></>}
                                {word3 && <><br />{word3}</>}
                            </h1>
                        </div>

                        <div className={`transition-all duration-700 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                            <p className="font-body text-gray-500 text-lg leading-relaxed max-w-md mb-8">
                                {cfg.hero?.description}
                            </p>
                        </div>

                        <div className={`flex flex-wrap gap-3 mb-10 transition-all duration-700 delay-[400ms] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                            {(cfg.hero?.tags || []).map((tag: string) => (
                                <span key={tag} className="font-body text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-3 py-1.5">
                  {tag}
                </span>
                            ))}
                        </div>

                        <div className={`flex items-center gap-4 flex-wrap transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                            {projects.length > 0 && (
                            <a href="#work"
                               className="inline-flex items-center gap-3 bg-[#4353FF] text-white font-body font-semibold px-7 py-4 hover:bg-[#0f0f0f] transition-all duration-300 group relative overflow-hidden">
                                <span className="absolute inset-0 bg-[#0f0f0f] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-400" />
                                <span className="relative">View Work</span>
                                <span className="relative group-hover:rotate-45 transition-transform duration-300">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M1.5 1.5h10v10M1.5 11.5l10-10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                            </a>
                            )}
                            {hasResumePdf && (
                            <a href={resumeUrl}
                               className="inline-flex items-center gap-2 border-2 border-[var(--text)] text-[var(--text)] font-body font-semibold px-6 py-3.5 hover:bg-[var(--text)] hover:text-white transition-all duration-300 text-sm">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M7 1v8M4 6l3 3 3-3M2 10v1a1 1 0 001 1h8a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Download CV
                            </a>
                            )}
                        </div>
                    </div>

                    {/* Right — photo. Only rendered when a profile image has been uploaded. */}
                    {cfg.hero?.image && (
                    <div className={`relative transition-all duration-1000 delay-200 ${loaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}>
                        {/* Main photo frame */}
                        <div className="relative mx-auto w-full max-w-[420px]">
                            <div className="aspect-[3/4] overflow-hidden bg-gray-200 relative group cursor-pointer">
                                <img
                                    src={cfg.hero.image}
                                    alt="Hero Profile"
                                    className={`w-full h-full object-cover transition-all duration-700 ${cfg.hero?.image3d ? 'group-hover:opacity-0' : ''}`}
                                />
                                {cfg.hero?.image3d && (
                                    <img
                                        src={cfg.hero?.image3d}
                                        alt="Hero Profile 3D"
                                        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#4353FF]/30 to-transparent pointer-events-none" />
                            </div>

                            {/* Blue accent bar */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4353FF]" />
                        </div>
                    </div>
                    )}
                </div>
            </section>

            {/* ── SKILLS ── plain text list; the section is hidden when there is nothing to list */}
            {(validSkills.length > 0 || otherSkills.length > 0) && (
            <section id="skills" className="py-20 bg-[var(--app-bg)]" ref={skillsRef.ref}>
                <div className="max-w-[1300px] mx-auto px-6 md:px-10">
                    <div className={`mb-12 transition-all duration-700 ${skillsRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-6 h-[3px] bg-[#4353FF]" />
                            <span className="font-body font-semibold text-[#4353FF] text-xs uppercase tracking-[0.2em]">My Expertise</span>
                        </div>
                        <h2 className="font-heading font-black text-[var(--text)] uppercase text-[clamp(1.6rem,2.8vw,2.4rem)] tracking-tight">
                            SKILLS & TECHNOLOGIES
                        </h2>
                    </div>

                    {validSkills.length > 0 && (
                        <ul className={`flex flex-wrap gap-x-10 gap-y-3 transition-all duration-700 ${skillsRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                            {validSkills.map((skill: { name: string }) => (
                                <li key={skill.name} className="font-heading font-bold text-[var(--text)] text-base">{skill.name}</li>
                            ))}
                        </ul>
                    )}

                    {otherSkills.length > 0 && (
                        <div className={`${validSkills.length > 0 ? "mt-14 pt-10 border-t border-[var(--border)]" : ""} transition-all duration-700 delay-500 ${skillsRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                            <p className="font-body text-xs text-gray-400 uppercase tracking-widest mb-5">Also familiar with</p>
                            <ul className="flex flex-wrap gap-x-8 gap-y-2">
                                {otherSkills.map((tech: string) => (
                                    <li key={tech} className="font-body text-sm text-gray-500">{tech}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>
            )}

            {/* ── WORK EXPERIENCE ── hidden when there are no entries */}
            {validExperiences.length > 0 && (
            <section className="py-20 bg-[var(--app-bg)]" ref={expRef.ref}>
                <div className="max-w-[1300px] mx-auto px-6 md:px-10">
                    <div className={`mb-12 transition-all duration-700 ${expRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-6 h-[3px] bg-[#4353FF]" />
                            <span className="font-body font-semibold text-[#4353FF] text-xs uppercase tracking-[0.2em]">My Journey</span>
                        </div>
                        <h2 className="font-heading font-black text-[var(--text)] uppercase text-[clamp(1.6rem,2.8vw,2.4rem)] tracking-tight">
                            WORK EXPERIENCE
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-gray-200 hidden md:block" />

                        <div className="space-y-6">
                            {validExperiences.map((exp: any, i: number) => (
                                <div
                                    key={i}
                                    className={`group relative md:pl-16 transition-all duration-700 ${expRef.inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                                    style={{ transitionDelay: `${i * 120}ms` }}
                                >
                                    {/* Timeline dot */}
                                    <div className="hidden md:flex absolute left-0 top-6 w-10 h-10 rounded-full bg-white border-2 border-gray-200 group-hover:border-[#4353FF] items-center justify-center transition-colors duration-300 shadow-sm z-10">
                                        <div className="w-3 h-3 rounded-full bg-gray-300 group-hover:bg-[#4353FF] transition-colors duration-300" />
                                    </div>

                                    <div className="bg-[var(--surface)] p-7 border border-[var(--border)] group-hover:border-[#4353FF]/30 group-hover:shadow-[0_8px_30px_rgba(67,83,255,0.08)] transition-all duration-300 relative overflow-hidden">
                                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#4353FF] group-hover:w-full transition-all duration-500" />

                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                            <div>
                                                <h3 className="font-heading font-black text-[var(--text)] text-lg group-hover:text-[#4353FF] transition-colors">{exp.role}</h3>
                                                <p className="font-body text-[#4353FF] text-sm font-semibold">{exp.company}</p>
                                            </div>
                                            <span className="font-body text-xs text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 whitespace-nowrap self-start">
                        {exp.period}
                      </span>
                                        </div>
                                        <p className="font-body text-gray-500 text-sm leading-relaxed mb-4">{exp.desc}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(exp.tags || []).map((tag: string) => (
                                                <span key={tag} className="font-body text-xs text-[#4353FF] bg-[#4353FF]/8 px-2.5 py-1 font-medium">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            )}

            {/* ── PROJECTS ── hidden when there are no published projects */}
            {projects.length > 0 && (
            <section id="work" className="py-20 bg-[var(--app-bg)]" ref={projRef.ref}>
                <div className="max-w-[1300px] mx-auto px-6 md:px-10">
                    <div className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 transition-all duration-700 ${projRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-6 h-[3px] bg-[#4353FF]" />
                                <span className="font-body font-semibold text-[#4353FF] text-xs uppercase tracking-[0.2em]">Selected Work</span>
                            </div>
                            <h2 className="font-heading font-black text-[var(--text)] uppercase text-[clamp(1.6rem,2.8vw,2.4rem)] tracking-tight">
                                PROJECTS
                            </h2>
                        </div>
                        {/* Filter tabs */}
                        <div className="flex flex-wrap gap-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`font-body font-medium text-xs px-4 py-2 border transition-all duration-200 ${
                                        activeTab === tab
                                            ? "bg-[#4353FF] text-white border-[#4353FF]"
                                            : "bg-white text-gray-500 border-gray-200 hover:border-[#4353FF] hover:text-[#4353FF]"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                        {filtered.map((p, i) => (
                            <ProjectCard key={i} p={p} i={i} inView={projRef.inView} />
                        ))}
                    </div>
                </div>
            </section>
            )}

            {/* ── EDUCATION ── hidden when there are no entries */}
            {validEducation.length > 0 && (
            <section className="py-20 bg-[var(--app-bg)]" ref={eduRef.ref}>
                <div className="max-w-[1300px] mx-auto px-6 md:px-10">
                    <div className={`mb-12 transition-all duration-700 ${eduRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-6 h-[3px] bg-[#4353FF]" />
                            <span className="font-body font-semibold text-[#4353FF] text-xs uppercase tracking-[0.2em]">Education</span>
                        </div>
                        <h2 className="font-heading font-black text-[var(--text)] uppercase text-[clamp(1.6rem,2.8vw,2.4rem)] tracking-tight">
                            ACADEMIC BACKGROUND
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        {validEducation.map((edu: any, i: number) => (
                            <div
                                key={i}
                                className={`group bg-[var(--surface)] p-8 border border-[var(--border)] hover:border-[#4353FF]/30 hover:shadow-lg transition-all duration-400 relative overflow-hidden ${eduRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                                style={{ transitionDelay: `${i * 150}ms` }}
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-[#4353FF]/4 rounded-bl-[60px] group-hover:bg-[#4353FF]/8 transition-colors" />
                                <div className="w-10 h-10 bg-[#4353FF]/10 flex items-center justify-center mb-5 group-hover:bg-[#4353FF] transition-colors duration-300">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="group-hover:[&>path]:stroke-white transition-all">
                                        <path d="M9 2L17 6l-8 4L1 6l8-4z" stroke="#4353FF" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                                        <path d="M1 6v6M17 6v6M5 8v4c0 1.1 1.8 2 4 2s4-.9 4-2V8" stroke="#4353FF" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                                    </svg>
                                </div>
                                <h3 className="font-heading font-black text-[var(--text)] text-lg mb-1 group-hover:text-[#4353FF] transition-colors">{edu.degree}</h3>
                                <p className="font-body text-[#4353FF] text-sm font-semibold mb-3">{edu.school}</p>
                                <div className="flex items-center justify-between">
                                    <span className="font-body text-xs text-gray-400">{edu.period}</span>
                                    <span className="font-body text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1">{edu.grade}</span>
                                </div>
                                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#4353FF] group-hover:w-full transition-all duration-500" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            )}

            {/* ── CONTACT CTA ── */}
            <section id="contact" className="py-24 bg-[#0f0f0f] relative overflow-hidden" ref={ctaRef.ref}>
                <div className="absolute inset-0 opacity-[0.04]"
                     style={{ backgroundImage: "radial-gradient(circle, #4353FF 1px, transparent 1px)", backgroundSize: "28px 28px" }}
                />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4353FF] to-transparent opacity-30" />

                <div className={`relative max-w-[1300px] mx-auto px-6 md:px-10 text-center transition-all duration-700 ${ctaRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                    <p className="font-body text-xs text-[#4353FF] uppercase tracking-widest mb-4">Let's collaborate</p>
                    <h2 className="font-heading font-black text-white uppercase leading-tight text-[clamp(2rem,5vw,4rem)] tracking-tight mb-6">
                        GOT A PROJECT IN MIND?<br />LET'S BUILD IT.
                    </h2>
                    <p className="font-body text-gray-400 max-w-md mx-auto mb-10">
                        I'm currently open to new opportunities. Whether it's a full product or just a quick question, my inbox is always open.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href={`mailto:${site.email}`}
                           className="inline-flex items-center justify-center gap-3 bg-[#4353FF] text-white font-body font-semibold px-8 py-4 hover:bg-white hover:text-[#0f0f0f] transition-all duration-300 group relative overflow-hidden">
                            <span className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-400" />
                            <span className="relative group-hover:text-[#0f0f0f]">{site.email}</span>
                        </a>
                        <Link href="/"
                              className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white font-body font-semibold px-7 py-4 hover:border-white hover:bg-white hover:text-[#0f0f0f] transition-all duration-300 text-sm">
                            ← Back to Agency Site
                        </Link>
                    </div>

                    {/* Social row: real profile links from lib/site.ts; hidden while there are none */}
                    {site.socials.length > 0 && (
                        <div className="flex items-center justify-center gap-6 mt-14 pt-10 border-t border-white/10">
                            {site.socials.map(social => (
                                <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-gray-500 uppercase tracking-widest hover:text-[#4353FF] transition-colors">{social.label}</a>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}