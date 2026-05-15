"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

// ── useInView ─────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

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
        const timer = setTimeout(() => setInView(true), 2000);
        return () => { obs.disconnect(); clearTimeout(timer); };
    }, [threshold]);
    return { ref, inView };
}

// ── Counter ───────────────────────────────────────────────────────────────
function Counter({ target, suffix = "", duration = 1600 }: { target: number; suffix?: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView(0.3);
    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(start);
        }, 16);
        return () => clearInterval(timer);
    }, [inView, target, duration]);
    return <span ref={ref}>{count}{suffix}</span>;
}

// ── ProjectCard ───────────────────────────────────────────────────────────
function ProjectCard({ p, i, inView }: { p: any; i: number; inView: boolean }) {
    return (
        <a
            href={p.link || "#"}
            className={`group relative overflow-hidden bg-[var(--surface)] block transition-all duration-700 rounded-2xl border border-[var(--border)] ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
        >
            <div className="aspect-[16/10] overflow-hidden">
                <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>

            {/* Overlay — theme-safe */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms]" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[400ms]">
                <span className="font-body text-xs text-[#4353FF] bg-[#4353FF]/20 backdrop-blur-sm px-3 py-1 mb-2 inline-block font-semibold rounded-full">
                    {p.type}
                </span>
                <h3 className="font-heading font-black text-white text-xl">{p.title}</h3>
                <p className="font-body text-white/70 text-sm mt-1">{p.description}</p>
            </div>

            {/* Year badge */}
            <div className="absolute top-4 right-4 font-body text-xs font-bold text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                {p.createdAt ? p.createdAt.substring(0, 4) : new Date().getFullYear()}
            </div>

            {/* Arrow — blue bg, white icon */}
            <div className="absolute top-4 left-4 w-9 h-9 bg-[#4353FF] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 12L12 2M12 2H4M12 2v8" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </a>
    );
}

// ── Navbar (matches main Navbar design) ───────────────────────────────────
const portfolioNavLinks = [
    { label: "About",   href: "#about"   },
    { label: "Skills",  href: "#skills"  },
    { label: "Work",    href: "#work"    },
    { label: "Contact", href: "#contact" },
];

function PortfolioNavbar({ shortTitle }: { shortTitle: string }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
                    scrolled
                        ? "bg-[var(--nav-bg)]/95 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.06)] py-3"
                        : "bg-transparent py-5"
                }`}
            >
                <div className="max-w-[1300px] mx-auto px-6 md:px-10 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
                        <div className="w-8 h-8 bg-[#0f0f0f] rounded flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                <path d="M4 3h7.5C13.985 3 16 5.015 16 7.5S13.985 12 11.5 12H4V3z" fill="white"/>
                                <path d="M4 12l5 5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div className="leading-[1.15]">
                            <span className="block font-heading font-black text-[15px] text-[var(--text)] tracking-tight">
                                {shortTitle || "ismaillabs"}
                            </span>
                            <span className="block font-body text-[9px] text-[var(--text-faint)] uppercase tracking-[0.22em]">
                                agency
                            </span>
                        </div>
                    </Link>

                    {/* Desktop nav — floating pill, absolutely centered */}
                    <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-2 rounded-full px-2.5 py-2 bg-[var(--surface)]/70 backdrop-blur-xl border border-[var(--border)] shadow-[0_10px_28px_rgba(8,8,20,0.08)]">
                        {portfolioNavLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="relative font-body font-medium text-[13px] tracking-wide transition-all duration-200 group px-4 py-2 rounded-full text-[var(--text)] hover:text-[#4353FF] hover:bg-[var(--app-bg)]/70"
                            >
                                {link.label}
                                <span className="absolute bottom-[5px] left-1/2 -translate-x-1/2 h-[1.5px] bg-[#4353FF] w-0 group-hover:w-5 transition-all duration-300" />
                            </a>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <a
                            href="#contact"
                            className="hidden md:inline-flex items-center gap-2 bg-[#4353FF] text-white font-body font-semibold text-[13px] px-5 py-2.5 rounded-full hover:bg-[var(--text)] transition-all duration-300"
                        >
                            Hire Me
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                <path d="M1 11L11 1M11 1H4M11 1v7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </a>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                            aria-expanded={menuOpen}
                            className={`md:hidden w-11 h-11 rounded-full border-2 flex flex-col items-center justify-center gap-[5px] transition-all duration-300 hover:scale-105 ${
                                menuOpen
                                    ? "border-[#4353FF] bg-[#4353FF]"
                                    : "border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-sm hover:border-[#4353FF]"
                            }`}
                        >
                            <span className={`block h-[1.5px] transition-all duration-300 origin-center ${menuOpen ? "w-[14px] rotate-45 translate-y-[3.5px] bg-white" : "w-[18px] bg-[var(--text)]"}`} />
                            <span className={`block h-[1.5px] transition-all duration-300 origin-center ${menuOpen ? "w-[14px] -rotate-45 -translate-y-[3.5px] bg-white" : "w-[12px] bg-[var(--text)]"}`} />
                        </button>
                    </div>
                </div>

                {/* Mobile dropdown */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-[400ms] ease-in-out ${
                        menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                    } bg-[var(--surface)] border-t border-[var(--border)] mt-3`}
                >
                    <div className="px-6 py-5 flex flex-col gap-1">
                        {portfolioNavLinks.map((link, i) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                style={{ transitionDelay: menuOpen ? `${i * 40}ms` : "0ms" }}
                                className={`font-body font-medium text-base py-3 border-b border-[var(--border)] text-[var(--text)] transition-all duration-300 ${
                                    menuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                                }`}
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href="#contact"
                            onClick={() => setMenuOpen(false)}
                            className="mt-4 text-center rounded-full bg-[#4353FF] text-white font-body font-semibold py-3 text-sm"
                        >
                            Hire Me
                        </a>
                    </div>
                </div>
            </header>

            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/35 z-30 backdrop-blur-sm"
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function PortfolioPage() {
    const [loaded, setLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState("All");
    const heroRef  = useInView(0.1);
    const skillsRef = useInView(0.1);
    const expRef   = useInView(0.1);
    const projRef  = useInView(0.1);
    const eduRef   = useInView(0.1);
    const ctaRef   = useInView(0.1);

    const [cfg, setCfg] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        setTimeout(() => setLoaded(true), 80);
        const timestamp = new Date().getTime();
        document.body.style.overflow = "";

        fetch(`/api/personal-portfolio?t=${timestamp}`, { cache: "no-store" })
            .then(r => r.json())
            .then(d => {
                const safe = d || {};
                setCfg({
                    ...safe,
                    hero:         safe.hero         || {},
                    skills:       Array.isArray(safe.skills)       ? safe.skills       : [],
                    otherSkills:  Array.isArray(safe.otherSkills)  ? safe.otherSkills  : [],
                    experiences:  Array.isArray(safe.experiences)  ? safe.experiences  : [],
                    education:    Array.isArray(safe.education)    ? safe.education    : [],
                });
            });

        fetch(`/api/projects?t=${timestamp}`, { cache: "no-store" })
            .then(r => r.json())
            .then(d => setProjects(d.items || []));

        return () => { document.body.style.overflow = ""; };
    }, []);

    const tabs = ["All", ...Array.from(new Set<string>(projects.map(p => p.type).filter(Boolean)))];
    const filtered = activeTab === "All" ? projects : projects.filter(p => p.type === activeTab);

    const validSkills      = (cfg?.skills       || []).filter((s: any) => (s?.name  || "").trim().length > 0);
    const validExperiences = (cfg?.experiences   || []).filter((e: any) =>
        (e?.role || "").trim() || (e?.company || "").trim() || (e?.period || "").trim() ||
        (e?.desc || "").trim() || ((e?.tags || []).length > 0)
    );
    const validEducation   = (cfg?.education     || []).filter((e: any) =>
        (e?.degree || "").trim() || (e?.school || "").trim() ||
        (e?.period || "").trim() || (e?.grade  || "").trim()
    );

    if (!cfg) return (
        <div className="min-h-screen bg-[var(--app-bg)] flex items-center justify-center font-body text-[var(--text)]">
            Loading...
        </div>
    );

    const heroTitleParts = (cfg.hero?.title || "ISMAIL LABS DEV.").split(" ");
    const word1 = heroTitleParts[0] || "ISMAIL";
    const word2 = heroTitleParts[1] || "LABS";
    const word3 = heroTitleParts.slice(2).join(" ") || "DEV.";

    return (
        <main className="bg-[var(--app-bg)] min-h-screen font-body">

            {/* ── NAVBAR ── */}
            <PortfolioNavbar shortTitle={cfg.hero?.shortTitle} />

            {/* ── HERO ── */}
            <section id="about" className="min-h-screen flex items-center pt-24 pb-16 relative overflow-hidden" ref={heroRef.ref}>
                {/* Ghost circles */}
                <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#4353FF]/10 pointer-events-none" />
                <div className="absolute right-[0%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#4353FF]/10 pointer-events-none" />

                <div className="max-w-[1300px] mx-auto px-6 md:px-10 w-full grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left */}
                    <div>
                        {/* Eyebrow */}
                        <div className={`transition-all duration-700 delay-100 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                            <div className="inline-flex items-center gap-3 mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#4353FF] opacity-60 animate-ping" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4353FF]" />
                                </span>
                                <span className="font-body text-xs font-semibold text-[#4353FF] uppercase tracking-[0.26em]">Available for work</span>
                            </div>
                        </div>

                        {/* Headline */}
                        <div className={`transition-all duration-700 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                            <h1
                                className="font-heading font-black text-[var(--text)] uppercase leading-[0.9] tracking-tight mb-6"
                                style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
                            >
                                {word1}<br />
                                <span className="text-[#4353FF]">{word2}</span><br />
                                {word3}
                            </h1>
                        </div>

                        {/* Description — theme-safe */}
                        <div className={`transition-all duration-700 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                            <p className="font-body text-[var(--text-soft)] text-lg leading-relaxed max-w-md mb-8">
                                {cfg.hero?.description}
                            </p>
                        </div>

                        {/* Tag chips — pill, theme-safe */}
                        <div className={`flex flex-wrap gap-3 mb-10 transition-all duration-700 delay-[400ms] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                            {(cfg.hero?.tags || []).map((tag: string) => (
                                <span
                                    key={tag}
                                    className="font-body text-xs font-semibold text-[var(--text-soft)] bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* CTAs — pill, theme-safe */}
                        <div className={`flex items-center gap-4 flex-wrap transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                            <a
                                href="#work"
                                className="inline-flex items-center gap-3 bg-[#4353FF] text-white font-body font-semibold px-7 py-4 rounded-full hover:bg-[var(--text)] transition-all duration-[400ms] group"
                            >
                                <span>View Work</span>
                                <span className="group-hover:rotate-45 transition-transform duration-300">
                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                        <path d="M1.5 1.5h10v10M1.5 11.5l10-10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            </a>
                            <a
                                href={cfg.hero?.resumeUrl || "#"}
                                className="inline-flex items-center gap-2 border-[1.5px] border-[var(--text)] text-[var(--text)] font-body font-semibold px-6 py-3.5 rounded-full hover:bg-[var(--text)] hover:text-white transition-all duration-300 text-sm"
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M7 1v8M4 6l3 3 3-3M2 10v1a1 1 0 001 1h8a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Download CV
                            </a>
                        </div>
                    </div>

                    {/* Right — photo + stats */}
                    <div className={`relative transition-all duration-1000 delay-200 ${loaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}>
                        <div className="relative mx-auto w-full max-w-[420px]">
                            <div className="aspect-[3/4] overflow-hidden bg-[var(--surface)] relative group cursor-pointer">
                                <img
                                    src={cfg.hero?.image || "https://html.ravextheme.com/redox/light/assets/imgs/web-development/team-1.webp"}
                                    alt="Hero Profile"
                                    className={`w-full h-full object-cover transition-all duration-700 ${cfg.hero?.image3d ? "group-hover:opacity-0" : ""}`}
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

                            {/* Experience badge */}
                            <div className="absolute -left-8 top-12 bg-[#4353FF] text-white p-4">
                                <p className="font-heading font-black text-3xl leading-none"><Counter target={cfg.hero?.yearsExp || 0} suffix="+" /></p>
                                <p className="font-body text-xs mt-1 opacity-90">Years Exp.</p>
                            </div>

                            {/* Projects badge — theme-safe */}
                            <div className="absolute -right-6 bottom-16 bg-[var(--surface)] border border-[var(--border)] p-4">
                                <p className="font-heading font-black text-3xl leading-none text-[#4353FF]"><Counter target={cfg.hero?.projectsCount || 0} suffix="+" /></p>
                                <p className="font-body text-[var(--text-faint)] text-xs mt-1">Projects</p>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4353FF]" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SKILLS ── */}
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

                    <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
                        {validSkills.map((skill: { name: string; level: number }, i: number) => (
                            <div
                                key={skill.name}
                                className={`transition-all duration-700 ${skillsRef.inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
                                style={{ transitionDelay: `${i * 80}ms` }}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-heading font-bold text-[var(--text)] text-sm">{skill.name}</span>
                                    <span className="font-body text-xs text-[#4353FF] font-semibold">{skill.level}%</span>
                                </div>
                                {/* Skill bar — theme-safe track */}
                                <div className="h-1.5 bg-[var(--surface)] relative overflow-hidden rounded-full">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-[#4353FF] rounded-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: skillsRef.inView ? `${skill.level}%` : "0%",
                                            transitionDelay: `${200 + i * 80}ms`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tech stack chips — pill, theme-safe */}
                    {cfg.otherSkills && cfg.otherSkills.length > 0 && (
                        <div className={`mt-14 pt-10 border-t border-[var(--border)] transition-all duration-700 delay-500 ${skillsRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                            <p className="font-body text-xs text-[var(--text-faint)] uppercase tracking-widest mb-5">Also familiar with</p>
                            <div className="flex flex-wrap gap-2">
                                {cfg.otherSkills.map((tech: string) => (
                                    <span
                                        key={tech}
                                        className="font-body text-xs text-[var(--text-soft)] border border-[var(--border)] px-3 py-1.5 rounded-full hover:border-[#4353FF] hover:text-[#4353FF] transition-colors cursor-default"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ── WORK EXPERIENCE ── */}
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
                        {/* Timeline line — theme-safe */}
                        <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-[var(--border)] hidden md:block" />

                        <div className="space-y-6">
                            {validExperiences.map((exp: any, i: number) => (
                                <div
                                    key={i}
                                    className={`group relative md:pl-16 transition-all duration-700 ${expRef.inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                                    style={{ transitionDelay: `${i * 120}ms` }}
                                >
                                    {/* Timeline dot */}
                                    <div className="hidden md:flex absolute left-0 top-6 w-10 h-10 rounded-full bg-[var(--surface)] border-2 border-[var(--border)] group-hover:border-[#4353FF] items-center justify-center transition-colors duration-300 z-10">
                                        <div className="w-3 h-3 rounded-full bg-[var(--border)] group-hover:bg-[#4353FF] transition-colors duration-300" />
                                    </div>

                                    <div className="bg-[var(--surface)] p-7 border border-[var(--border)] group-hover:border-[#4353FF]/30 group-hover:shadow-[0_8px_30px_rgba(67,83,255,0.08)] transition-all duration-300 relative overflow-hidden">
                                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#4353FF] group-hover:w-full transition-all duration-500" />

                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                            <div>
                                                <h3 className="font-heading font-black text-[var(--text)] text-lg group-hover:text-[#4353FF] transition-colors">{exp.role}</h3>
                                                <p className="font-body text-[#4353FF] text-sm font-semibold">{exp.company}</p>
                                            </div>
                                            {/* Period badge — theme-safe */}
                                            <span className="font-body text-xs text-[var(--text-faint)] bg-[var(--app-bg)] border border-[var(--border)] px-3 py-1.5 whitespace-nowrap self-start">
                                                {exp.period}
                                            </span>
                                        </div>
                                        <p className="font-body text-[var(--text-soft)] text-sm leading-relaxed mb-4">{exp.desc}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(exp.tags || []).map((tag: string) => (
                                                <span key={tag} className="font-body text-xs text-[#4353FF] bg-[#4353FF]/8 px-2.5 py-1 font-medium rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PROJECTS ── */}
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

                        {/* Filter tabs — pill, theme-safe */}
                        <div className="flex flex-wrap gap-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`font-body font-medium text-xs px-4 py-2 rounded-full border-[1.5px] transition-all duration-200 ${
                                        activeTab === tab
                                            ? "bg-[#4353FF] text-white border-[#4353FF]"
                                            : "bg-transparent text-[var(--text-soft)] border-[var(--border)] hover:border-[#4353FF] hover:text-[#4353FF]"
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

            {/* ── EDUCATION ── */}
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
                                className={`group bg-[var(--surface)] p-8 border border-[var(--border)] hover:border-[#4353FF]/30 hover:shadow-[0_8px_30px_rgba(67,83,255,0.08)] transition-all duration-[400ms] relative overflow-hidden ${
                                    eduRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                }`}
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
                                    <span className="font-body text-xs text-[var(--text-faint)]">{edu.period}</span>
                                    {/* Grade badge — theme-safe */}
                                    <span className="font-body text-xs font-semibold text-[var(--text-soft)] bg-[var(--app-bg)] border border-[var(--border)] px-3 py-1">
                                        {edu.grade}
                                    </span>
                                </div>
                                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#4353FF] group-hover:w-full transition-all duration-500" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CONTACT CTA ── */}
            <section id="contact" className="py-24 bg-[var(--text)] relative overflow-hidden" ref={ctaRef.ref}>
                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: "radial-gradient(circle, #4353FF 1px, transparent 1px)", backgroundSize: "28px 28px" }}
                />
                <div className="absolute top-0 left-0 w-full h-px bg-[#4353FF] opacity-30" />

                <div className={`relative max-w-[1300px] mx-auto px-6 md:px-10 text-center transition-all duration-700 ${ctaRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-6 h-[2px] bg-[#4353FF]" />
                        <p className="font-body text-xs text-[#4353FF] uppercase tracking-widest">Let's collaborate</p>
                        <div className="w-6 h-[2px] bg-[#4353FF]" />
                    </div>
                    <h2 className="font-heading font-black text-white uppercase leading-tight text-[clamp(2rem,5vw,4rem)] tracking-tight mb-6">
                        GOT A PROJECT IN MIND?<br />LET'S BUILD IT.
                    </h2>
                    <p className="font-body text-white/60 max-w-md mx-auto mb-10">
                        I'm currently open to new opportunities. Whether it's a full product or just a quick question, my inbox is always open.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {/* Email CTA — pill */}
                        <a
                            href="mailto:hello@ismaillabs.com"
                            className="inline-flex items-center justify-center gap-3 bg-[#4353FF] text-white font-body font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-[#0f0f0f] transition-all duration-[400ms]"
                        >
                            hello@ismaillabs.com
                        </a>
                        {/* Back link — pill */}
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 border-[1.5px] border-white/20 text-white font-body font-semibold px-7 py-4 rounded-full hover:border-white hover:bg-white hover:text-[#0f0f0f] transition-all duration-300 text-sm"
                        >
                            ← Back to Agency Site
                        </Link>
                    </div>

                    {/* Social row */}
                    <div className="flex items-center justify-center gap-6 mt-14 pt-10 border-t border-white/10">
                        {["GitHub", "LinkedIn", "Twitter", "Dribbble"].map(s => (
                            <a key={s} href="#" className="font-body text-xs text-white/40 uppercase tracking-widest hover:text-[#4353FF] transition-colors">
                                {s}
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}