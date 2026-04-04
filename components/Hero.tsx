"use client";
import { useEffect, useState } from "react";

export default function Hero() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Trigger entrance animations after mount
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    return (
        <section
            id="home"
            className="relative w-full min-h-screen overflow-hidden bg-[#EBEBEB] flex items-center"
        >
            {/* ── Large ghost circle watermark — center-left behind text ── */}
            <div
                className={`absolute top-1/2 -translate-y-1/2 rounded-full border border-gray-300/60 bg-white/30 pointer-events-none transition-all duration-1000 delay-200 ${
                    loaded ? "opacity-100 scale-100" : "opacity-0 scale-75"
                }`}
                style={{
                    left: "8%",
                    width: "min(52vw, 600px)",
                    height: "min(52vw, 600px)",
                }}
            />
            {/* Inner smaller ghost circle */}
            <div
                className="absolute top-1/2 -translate-y-1/2 rounded-full border border-gray-300/40 pointer-events-none"
                style={{
                    left: "calc(8% + min(8vw, 80px))",
                    width: "min(38vw, 440px)",
                    height: "min(38vw, 440px)",
                }}
            />

            {/* ── Blue-tinted circular image — hard right, bleeds off top & right ── */}
            <div
                className={`absolute right-0 top-[-4%] pointer-events-none transition-all duration-1000 delay-100 ${
                    loaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
                }`}
                style={{
                    width: "min(46vw, 660px)",
                    height: "min(54vw, 780px)",
                }}
            >
                {/* Pill/circle shape — flat left edge, rounded right bleeds off screen */}
                <div
                    className="w-full h-full overflow-hidden relative"
                    style={{ borderRadius: "50% 0 0 50% / 50% 0 0 50%" }}
                >
                    {/* Grayscale photo */}
                    <img
                        src="https://html.ravextheme.com/redox/light/assets/imgs/web-development/hero-img-5.webp"
                        alt="Team at work"
                        className="w-full h-full object-cover object-top grayscale"
                    />
                    {/* Blue overlay — multiply blend for the exact blue tint */}
                    <div className="absolute inset-0 bg-[#2d3bff] opacity-65 mix-blend-multiply" />
                    {/* Dark vignette on left edge to blend into bg */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#EBEBEB] via-transparent to-transparent opacity-20" />
                </div>

                {/* Small floating circle — bottom-left of big circle, same blue tint */}
                <div
                    className={`absolute -bottom-2 -left-10 w-28 h-28 rounded-full overflow-hidden border-4 border-[#EBEBEB] z-10 transition-all duration-700 delay-500 ${
                        loaded ? "opacity-100 scale-100" : "opacity-0 scale-50"
                    }`}
                >
                    <img
                        src="https://html.ravextheme.com/redox/light/assets/imgs/web-development/about-img-7.webp"
                        alt=""
                        className="w-full h-full object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-[#2d3bff] opacity-65 mix-blend-multiply" />
                </div>
            </div>

            {/* ── Main text content ── */}
            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-14 pt-28 pb-16">

                {/* TURNED */}
                <div
                    className={`overflow-hidden transition-all duration-700 delay-[150ms] ${
                        loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
                >
                    <h1
                        className="font-heading font-black text-[#0f0f0f] leading-[0.88] tracking-[-0.02em] uppercase"
                        style={{ fontSize: "clamp(3.8rem, 9.5vw, 8.5rem)" }}
                    >
                        TURNED
                    </h1>
                </div>

                {/* INTO REALITY with the "O" as a blue ring */}
                <div
                    className={`overflow-hidden transition-all duration-700 delay-[280ms] ${
                        loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
                >
                    <h1
                        className="font-heading font-black text-[#0f0f0f] leading-[0.88] tracking-[-0.02em] uppercase flex items-center flex-wrap"
                        style={{ fontSize: "clamp(3.8rem, 9.5vw, 8.5rem)" }}
                    >
                        INT
                        {/* Blue "O" ring — the hero's signature detail */}
                        <span
                            className="inline-flex items-center justify-center relative mx-[0.04em]"
                            style={{
                                width: "clamp(3.0rem, 7.5vw, 6.7rem)",
                                height: "clamp(3.0rem, 7.5vw, 6.7rem)",
                            }}
                        >
              <span
                  className="block rounded-full border-[5px] md:border-[7px] border-[#4353FF] w-full h-full"
                  style={{
                      boxShadow: "0 0 0 0 rgba(67,83,255,0)",
                      animation: loaded ? "ringPulse 2.5s ease-in-out 1s infinite" : "none",
                  }}
              />
            </span>
                        {" "}REALITY
                    </h1>
                </div>

                {/* Subheading */}
                <p
                    className={`font-body text-gray-500 mt-7 mb-10 leading-relaxed max-w-[480px] transition-all duration-700 delay-[420ms] ${
                        loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)" }}
                >
                    With every single one of our clients, we bring forth a deep passion for creative
                    problem solving — which is what we deliver.
                </p>

                {/* CTA button */}
                <div
                    className={`transition-all duration-700 delay-[550ms] ${
                        loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    <a
                        href="#about"
                        className="inline-flex items-center gap-3 bg-[#4353FF] text-white font-body font-semibold px-7 py-4 hover:bg-[#0f0f0f] transition-all duration-300 group relative overflow-hidden"
                        style={{ fontSize: "clamp(0.85rem, 1.1vw, 0.95rem)" }}
                    >
                        {/* Slide-in hover fill */}
                        <span className="absolute inset-0 bg-[#0f0f0f] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-400 ease-in-out" />
                        <span className="relative">Get Started Now</span>
                        <span className="relative w-5 h-5 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2h10v10M2 12L12 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
                    </a>
                </div>

                {/* Brand logos strip at bottom */}

            </div>

            {/* Ring pulse keyframe */}
            <style>{`
        @keyframes ringPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(67,83,255,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(67,83,255,0); }
        }
      `}</style>
        </section>
    );
}