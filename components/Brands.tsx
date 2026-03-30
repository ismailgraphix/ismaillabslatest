"use client";
import { useEffect, useRef, useState } from "react";

// SVG logo placeholders that match the style in the screenshot
const brands = [
    {
        name: "Creative",
        svg: (
            <svg viewBox="0 0 90 50" fill="none" className="h-10 w-auto">
                <path d="M20 10 C10 10 5 18 5 25 C5 32 10 40 20 40 C26 40 31 37 34 32" stroke="#555" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M28 8 L22 14 L28 14 Z" fill="#555"/>
                <text x="42" y="38" fontFamily="sans-serif" fontWeight="700" fontSize="9" fill="#555" letterSpacing="2">CREATIVE</text>
            </svg>
        ),
    },
    {
        name: "Innovate",
        svg: (
            <svg viewBox="0 0 100 50" fill="none" className="h-10 w-auto">
                <circle cx="50" cy="25" r="18" stroke="#666" strokeWidth="1.5" strokeDasharray="3 3"/>
                <text x="50" y="22" textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize="11" fill="#444" fontWeight="600">Innovate</text>
                <text x="50" y="33" textAnchor="middle" fontFamily="sans-serif" fontSize="6" fill="#888" letterSpacing="1">OFFICE SOLUTIONS</text>
            </svg>
        ),
    },
    {
        name: "Company",
        svg: (
            <svg viewBox="0 0 80 55" fill="none" className="h-10 w-auto">
                <rect x="15" y="8" width="22" height="22" rx="1" stroke="#444" strokeWidth="2"/>
                <rect x="43" y="8" width="22" height="22" rx="1" stroke="#444" strokeWidth="2"/>
                <rect x="29" y="8" width="22" height="22" rx="1" fill="#EBEBEB" stroke="#444" strokeWidth="2"/>
                <text x="40" y="42" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="8" fill="#444" letterSpacing="1.5">COMPANY</text>
                <text x="40" y="51" textAnchor="middle" fontFamily="sans-serif" fontSize="5.5" fill="#999" letterSpacing="1">TAG LINE HERE</text>
            </svg>
        ),
    },
    {
        name: "Agency",
        svg: (
            <svg viewBox="0 0 90 55" fill="none" className="h-10 w-auto">
                <path d="M28 38 L45 10 L62 38" stroke="#444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M55 30 Q65 20 72 28" stroke="#444" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <text x="45" y="50" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="8" fill="#444" letterSpacing="1.5">COMPANY</text>
            </svg>
        ),
    },
    {
        name: "Diamond",
        svg: (
            <svg viewBox="0 0 90 50" fill="none" className="h-10 w-auto">
                <path d="M20 25 L35 10 L50 25 L35 40 Z" stroke="#444" strokeWidth="2" fill="none"/>
                <path d="M35 10 L50 25 L65 10 L50 -5" stroke="#444" strokeWidth="2" fill="none"/>
                <path d="M50 25 L65 10 L80 25 L65 40 Z" stroke="#444" strokeWidth="2" fill="none"/>
                <path d="M35 40 L50 25 L65 40 L50 55" stroke="#444" strokeWidth="2" fill="none"/>
            </svg>
        ),
    },
    {
        name: "tinder",
        svg: (
            <svg viewBox="0 0 80 40" fill="none" className="h-8 w-auto">
                <text x="5" y="30" fontFamily="Georgia, serif" fontSize="22" fill="#444" fontWeight="400" letterSpacing="-0.5">tinder</text>
                <text x="67" y="30" fontFamily="Georgia, serif" fontSize="22" fill="#444">.</text>
            </svg>
        ),
    },
];

// Duplicate for seamless loop
const allBrands = [...brands, ...brands];

export default function Brands() {
    const [paused, setPaused] = useState(false);

    return (
        <section className="bg-[#EBEBEB] py-12 overflow-hidden border-t border-gray-200/60">
            {/* Title */}
            <p className="text-center font-body text-[13px] tracking-[0.25em] text-gray-400 uppercase mb-8">
                <span className="font-semibold text-gray-600">WE WORKED WITH G</span>LOBAL LARGEST BRANDS
            </p>

            {/* Marquee track */}
            <div
                className="relative"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {/* Left fade */}
                <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#EBEBEB] to-transparent z-10 pointer-events-none" />
                {/* Right fade */}
                <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#EBEBEB] to-transparent z-10 pointer-events-none" />

                <div
                    className="flex items-center gap-0"
                    style={{
                        animation: `brandScroll 28s linear infinite`,
                        animationPlayState: paused ? "paused" : "running",
                        width: "max-content",
                    }}
                >
                    {allBrands.map((brand, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-center px-14 opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer grayscale hover:grayscale-0"
                            style={{ minWidth: "140px" }}
                        >
                            {brand.svg}
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes brandScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </section>
    );
}