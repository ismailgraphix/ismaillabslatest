// ── PortfolioNavbar ───────────────────────────────────────────────────────
// Drop this in place of the existing PortfolioNavbar inside portfolio/page.tsx
// (or extract to its own file). Mirrors the main Navbar design exactly.

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const portfolioNavLinks = [
    { label: "About",   href: "#about"   },
    { label: "Skills",  href: "#skills"  },
    { label: "Work",    href: "#work"    },
    { label: "Contact", href: "#contact" },
];

export default function PortfolioNavbar({ shortTitle }: { shortTitle?: string }) {
    const [scrolled,  setScrolled]  = useState(false);
    const [menuOpen,  setMenuOpen]  = useState(false);

    // Scroll-aware background
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Lock body scroll while drawer is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    // ESC to close drawer
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
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">

                    {/* ── Logo — same markup as main Navbar ── */}
                    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
                        <div className="leading-[1.15]">
                            <span className="block font-heading font-black text-[15px] text-[var(--text)] tracking-tight">
                                {shortTitle || "Ismaillabs"}
                            </span>
                            <span className="block font-body text-[9px] text-gray-400 uppercase tracking-[0.22em]">
                                digital agency
                            </span>
                        </div>
                    </Link>

                    {/* ── Desktop nav — floating pill, absolutely centered ── */}
                    <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-2 rounded-full px-2.5 py-2 bg-[var(--surface)]/70 backdrop-blur-xl border border-[var(--border)] shadow-[0_10px_28px_rgba(8,8,20,0.08)]">
                        {portfolioNavLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="relative font-body font-medium text-[13px] tracking-wide transition-all duration-200 group px-4 py-2 rounded-full text-[var(--text)] hover:text-[#4353FF] hover:bg-[var(--background)]/70"
                            >
                                {link.label}
                                <span className="absolute bottom-[5px] left-1/2 -translate-x-1/2 h-[1.5px] bg-[#4353FF] w-0 group-hover:w-5 transition-all duration-300" />
                            </a>
                        ))}
                    </nav>

                    {/* ── Right side ── */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        {/* "Hire Me" CTA — same shape/style as main "Let's Talk" */}
                        <a
                            href="#contact"
                            className="hidden md:inline-flex items-center gap-2 bg-[#4353FF] text-white font-body font-semibold text-[13px] px-5 py-2.5 hover:bg-[#0f0f0f] transition-all duration-300"
                        >
                            Hire Me
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                <path d="M1 11L11 1M11 1H4M11 1v7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>

                        {/* ── Mobile hamburger — identical to main Navbar ── */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                            aria-expanded={menuOpen}
                            aria-controls="portfolio-mobile-nav"
                            className={`md:hidden w-11 h-11 rounded-full border-2 flex flex-col items-center justify-center gap-[5px] transition-all duration-300 hover:scale-105 ${
                                menuOpen
                                    ? "border-[#4353FF] bg-[#4353FF]"
                                    : "border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-sm hover:border-[#4353FF]"
                            }`}
                        >
                            <span className={`block h-[1.5px] transition-all duration-300 origin-center ${
                                menuOpen ? "w-[14px] rotate-45 translate-y-[3.5px] bg-white" : "w-[18px] bg-[var(--text)]"
                            }`} />
                            <span className={`block h-[1.5px] transition-all duration-300 origin-center ${
                                menuOpen ? "w-[14px] -rotate-45 -translate-y-[3.5px] bg-white" : "w-[12px] bg-[var(--text)]"
                            }`} />
                        </button>
                    </div>
                </div>

                {/* ── Mobile dropdown — identical structure to main Navbar ── */}
                <div
                    id="portfolio-mobile-nav"
                    className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${
                        menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    } bg-[var(--surface)] border-t border-[var(--border)] mt-3`}
                >
                    <div className="px-6 py-5 flex flex-col gap-1">
                        {portfolioNavLinks.map((link, i) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                style={{ transitionDelay: menuOpen ? `${i * 40}ms` : "0ms" }}
                                className={`font-body font-medium text-base py-3 border-b border-gray-50 transition-all duration-300 text-[var(--text)] ${
                                    menuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                                }`}
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href="#contact"
                            onClick={() => setMenuOpen(false)}
                            className="mt-4 text-center rounded-xl bg-[#4353FF] text-white font-body font-semibold py-3 text-sm"
                        >
                            Hire Me
                        </a>
                    </div>
                </div>
            </header>

            {/* Drawer backdrop */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/35 z-30 backdrop-blur-sm"
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </>
    );
}