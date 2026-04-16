"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

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

    function isActive(href: string) {
        if (href === "/") return pathname === "/";
        const base = href.split("#")[0];
        return pathname === base || pathname.startsWith(base + "/");
    }

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
                    ? "bg-white/96 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)] py-3"
                    : "bg-transparent py-5"
                    }`}
            >
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">

                    {/* ── Logo ── */}
                    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
                        <div className="leading-[1.15]">
                            <span className="block font-heading font-black text-[15px] text-[#0f0f0f] tracking-tight">
                                Ismaillabs
                            </span>
                            <span className="block font-body text-[9px] text-gray-400 uppercase tracking-[0.22em]">
                                digital agency
                            </span>
                        </div>
                    </Link>

                    {/* ── Desktop nav — absolutely centered ── */}
                    <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`relative font-body font-medium text-[14px] tracking-wide transition-colors duration-200 group ${isActive(link.href)
                                    ? "text-[#4353FF]"
                                    : "text-[#111] hover:text-[#4353FF]"
                                    }`}
                            >
                                {link.label}
                                <span className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-[#4353FF] transition-all duration-300 ${isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                                    }`} />
                            </Link>
                        ))}
                    </nav>

                    {/* ── Right side ── */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/#contact"
                            className="hidden md:inline-flex items-center gap-2 bg-[#4353FF] text-white font-body font-semibold text-[13px] px-5 py-2.5 hover:bg-[#0f0f0f] transition-all duration-300"
                        >
                            Let&apos;s Talk
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                <path d="M1 11L11 1M11 1H4M11 1v7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                            className={`w-11 h-11 rounded-full border-2 flex flex-col items-center justify-center gap-[5px] transition-all duration-300 hover:scale-105 ${menuOpen
                                ? "border-[#4353FF] bg-[#4353FF]"
                                : "border-gray-300 bg-white/70 backdrop-blur-sm hover:border-[#4353FF]"
                                }`}
                        >
                            <span className={`block h-[1.5px] transition-all duration-300 origin-center ${menuOpen
                                ? "w-[14px] rotate-45 translate-y-[3.5px] bg-white"
                                : "w-[18px] bg-[#111]"
                                }`} />
                            <span className={`block h-[1.5px] transition-all duration-300 origin-center ${menuOpen
                                ? "w-[14px] -rotate-45 -translate-y-[3.5px] bg-white"
                                : "w-[12px] bg-[#111]"
                                }`} />
                        </button>
                    </div>
                </div>

                {/* ── Mobile dropdown ── */}
                <div className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    } bg-white border-t border-gray-100 mt-3`}>
                    <div className="px-6 py-5 flex flex-col gap-1">
                        {navLinks.map((link, i) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                style={{ transitionDelay: menuOpen ? `${i * 40}ms` : "0ms" }}
                                className={`font-body font-medium text-base py-3 border-b border-gray-50 transition-all duration-300 ${menuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                                    } ${isActive(link.href) ? "text-[#4353FF]" : "text-[#111]"}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/#contact"
                            onClick={() => setMenuOpen(false)}
                            className="mt-4 text-center bg-[#4353FF] text-white font-body font-semibold py-3 text-sm"
                        >
                            Let&apos;s Talk
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── Desktop side drawer ── */}
            <div className={`fixed top-0 right-0 h-full w-72 bg-[#0f0f0f] z-40 transition-transform duration-500 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"
                } hidden md:flex flex-col`}>
                <div className="p-10 pt-28 flex flex-col gap-4 flex-1 overflow-y-auto">
                    <p className="font-body text-[10px] text-gray-600 uppercase tracking-[0.2em] mb-3">
                        Menu
                    </p>
                    {navLinks.map((link, i) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            style={{ transitionDelay: menuOpen ? `${80 + i * 50}ms` : "0ms" }}
                            className={`font-heading font-black text-[1.75rem] leading-tight transition-all duration-300 ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                                } ${isActive(link.href) ? "text-[#4353FF]" : "text-white hover:text-[#4353FF]"}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <div className="px-10 py-8 border-t border-white/[0.06] flex-shrink-0">
                    <p className="font-body text-gray-500 text-xs">hello@ismaillabs.com</p>
                    <p className="font-body text-gray-700 text-[10px] mt-1.5">
                        © {new Date().getFullYear()} Ismail Labs
                    </p>
                </div>
            </div>

            {/* Drawer backdrop */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 backdrop-blur-sm hidden md:block"
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </>
    );
}