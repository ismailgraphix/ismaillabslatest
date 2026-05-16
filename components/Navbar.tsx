"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close drawer whenever user navigates
    useEffect(() => { setMenuOpen(false); }, [pathname]);

    // Lock body scroll while drawer is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    // Allow ESC to close drawer
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    function isActive(href: string) {
        if (href === "/") return pathname === "/";
        if (href.startsWith("#")) return false;
        const base = href.split("#")[0];
        return pathname === base || pathname.startsWith(base + "/");
    }

    function toHref(href: string) {
        if (!href.startsWith("#")) return href;
        return pathname === "/" ? href : `/${href}`;
    }

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
                    ? "bg-[var(--nav-bg)]/95 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.06)] py-3"
                    : "bg-transparent py-5"
                    }`}
            >
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">

                    {/* ── Logo ── */}
                    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
                        <div className="leading-[1.15]">
                            <span className="block font-heading font-black text-[15px] text-[var(--text)] tracking-tight">
                                {"<ismail labs />"}
                            </span>
                            <span className="block font-body text-[9px] text-gray-400 uppercase tracking-[0.22em]">
                                digital agency
                            </span>
                        </div>
                    </Link>

                    {/* ── Desktop nav — absolutely centered ── */}
                    <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-2 rounded-full px-2.5 py-2 bg-[var(--surface)]/70 backdrop-blur-xl border border-[var(--border)] shadow-[0_10px_28px_rgba(8,8,20,0.08)]">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={toHref(link.href)}
                                aria-current={isActive(link.href) ? "page" : undefined}
                                className={`relative font-body font-medium text-[13px] tracking-wide transition-all duration-200 group px-4 py-2 rounded-full ${isActive(link.href)
                                    ? "text-[#4353FF] bg-[#4353FF]/10"
                                    : "text-[var(--text)] hover:text-[#4353FF] hover:bg-[var(--background)]/70"
                                    }`}
                            >
                                {link.label}
                                <span className={`absolute bottom-[5px] left-1/2 -translate-x-1/2 h-[1.5px] bg-[#4353FF] transition-all duration-300 ${isActive(link.href) ? "w-6" : "w-0 group-hover:w-5"
                                    }`} />
                            </Link>
                        ))}
                    </nav>

                    {/* ── Right side ── */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            href={toHref("#contact")}
                            className="hidden md:inline-flex items-center gap-2 bg-[#4353FF] text-white border border-[#4353FF] rounded-full font-body font-semibold text-[13px] px-5 py-2.5 hover:bg-[#3d4ce6] transition-all duration-300"
                        >
                            Let&apos;s Talk
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                <path d="M1 11L11 1M11 1H4M11 1v7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                            aria-expanded={menuOpen}
                            aria-controls="mobile-nav-panel"
                            className={`md:hidden w-11 h-11 rounded-full border-2 flex flex-col items-center justify-center gap-[5px] transition-all duration-300 hover:scale-105 ${menuOpen
                                ? "border-[#4353FF] bg-[#4353FF]"
                                : "border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-sm hover:border-[#4353FF]"
                                }`}
                        >
                            <span className={`block h-[1.5px] transition-all duration-300 origin-center ${menuOpen
                                ? "w-[14px] rotate-45 translate-y-[3.5px] bg-white"
                                : "w-[18px] bg-[var(--text)]"
                                }`} />
                            <span className={`block h-[1.5px] transition-all duration-300 origin-center ${menuOpen
                                ? "w-[14px] -rotate-45 -translate-y-[3.5px] bg-white"
                                : "w-[12px] bg-[var(--text)]"
                                }`} />
                        </button>
                    </div>
                </div>

                {/* ── Mobile dropdown ── */}
                <div
                    id="mobile-nav-panel"
                    className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${menuOpen ? "max-h-[calc(100vh-6rem)] opacity-100" : "max-h-0 opacity-0"
                        } bg-[var(--surface)] border-t border-[var(--border)] mt-3 pb-5`}
                >
                    <div className="px-6 py-5 flex flex-col gap-1">
                        {navLinks.map((link, i) => (
                            <Link
                                key={link.label}
                                href={toHref(link.href)}
                                onClick={() => setMenuOpen(false)}
                                style={{ transitionDelay: menuOpen ? `${i * 40}ms` : "0ms" }}
                                className={`font-body font-medium text-base py-3 border-b border-gray-50 transition-all duration-300 ${menuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                                    } ${isActive(link.href) ? "text-[#4353FF]" : "text-[var(--text)]"}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href={toHref("#contact")}
                            onClick={() => setMenuOpen(false)}
                            className="mt-4 text-center rounded-full bg-[#4353FF] text-white border border-[#4353FF] font-body font-semibold py-3 text-sm hover:bg-[#3d4ce6] transition-colors duration-300"
                        >
                            Let&apos;s Talk
                        </Link>
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