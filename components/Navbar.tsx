"use client";
import { useState, useEffect } from "react";

const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [active, setActive] = useState("Home");

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
                    scrolled ? "bg-white shadow-[0_2px_30px_rgba(0,0,0,0.08)] py-3" : "bg-[#EBEBEB] py-4"
                }`}
            >
                <div className="w-full px-6 md:px-10 flex items-center justify-between">

                    {/* LOGO — left */}
                    <a href="#home" className="flex items-center gap-2 flex-shrink-0 group">
                        <div className="w-9 h-9 bg-[#0f0f0f] rounded flex items-center justify-center transition-transform group-hover:scale-95">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4 3h7.5C13.985 3 16 5.015 16 7.5S13.985 12 11.5 12H4V3z" fill="white"/>
                                <path d="M4 12l5 5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div className="leading-[1.1]">
                            <span className="block font-heading font-black text-[15px] text-[#0f0f0f] tracking-tight">ismaillabs</span>
                            <span className="block font-body text-[9px] text-gray-400 uppercase tracking-[0.2em]">agency</span>
                        </div>
                    </a>

                    {/* NAV LINKS — centered absolutely on desktop */}
                    <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-7">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setActive(link.label)}
                                className={`relative font-body font-medium text-[15px] transition-colors duration-200 group ${
                                    active === link.label ? "text-[#4353FF]" : "text-[#111] hover:text-[#4353FF]"
                                }`}
                            >
                                {link.label}
                                <span className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-[#4353FF] transition-all duration-300 ${
                                    active === link.label ? "w-full" : "w-0 group-hover:w-full"
                                }`}/>
                            </a>
                        ))}
                    </nav>

                    {/* RIGHT — circle hamburger always visible */}
                    <div className="flex items-center gap-3">
                        <a href="#contact" className="hidden md:inline-flex items-center gap-2 bg-[#4353FF] text-white font-body font-semibold text-[13px] px-5 py-2.5 rounded-sm hover:bg-[#0f0f0f] transition-all duration-300">
                            Let&apos;s Talk
                        </a>
                        {/* Circle menu button — exact match to original */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                            className="w-11 h-11 rounded-full border-2 border-gray-300 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center gap-[5px] hover:border-[#4353FF] transition-all duration-300 hover:scale-105"
                        >
                            <span className={`block h-[1.5px] bg-[#111] transition-all duration-300 origin-center ${menuOpen ? "w-[14px] rotate-45 translate-y-[3.5px]" : "w-[18px]"}`}/>
                            <span className={`block h-[1.5px] bg-[#111] transition-all duration-300 origin-center ${menuOpen ? "w-[14px] -rotate-45 -translate-y-[3.5px]" : "w-[14px]"}`}/>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"} bg-white border-t border-gray-100`}>
                    <div className="px-6 py-5 flex flex-col gap-1">
                        {navLinks.map((link, i) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => { setActive(link.label); setMenuOpen(false); }}
                                style={{ transitionDelay: menuOpen ? `${i * 50}ms` : "0ms" }}
                                className={`font-body font-medium text-base py-3 border-b border-gray-50 transition-all duration-300 ${
                                    menuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                                } ${active === link.label ? "text-[#4353FF]" : "text-[#111]"}`}
                            >
                                {link.label}
                            </a>
                        ))}
                        <a href="#contact" className="mt-4 text-center bg-[#4353FF] text-white font-body font-semibold py-3 rounded-sm">
                            Let&apos;s Talk
                        </a>
                    </div>
                </div>
            </header>

            {/* Full-screen side drawer (desktop) — the hamburger opens this */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-[#0f0f0f] z-40 transition-transform duration-500 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"} hidden md:block`}>
                <div className="p-10 pt-24 flex flex-col gap-6">
                    <p className="font-body text-xs text-gray-500 uppercase tracking-widest mb-4">Navigation</p>
                    {navLinks.map((link, i) => (
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={() => { setActive(link.label); setMenuOpen(false); }}
                            style={{ transitionDelay: menuOpen ? `${100 + i * 60}ms` : "0ms" }}
                            className={`font-heading font-black text-3xl transition-all duration-400 ${
                                menuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
                            } ${active === link.label ? "text-[#4353FF]" : "text-white hover:text-[#4353FF]"}`}
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <p className="font-body text-gray-400 text-sm">hello@ismaillabs.com</p>
                        <p className="font-body text-gray-400 text-sm mt-1">(505) 555-0125</p>
                    </div>
                </div>
            </div>
            {/* Drawer overlay */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 hidden md:block backdrop-blur-sm"
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </>
    );
}