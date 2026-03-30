"use client";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.2) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
}

function Counter({ target, suffix = "+", duration = 1800 }: { target: number; suffix?: string; duration?: number }) {
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

export default function About() {
    const { ref, inView } = useInView(0.15);

    return (
        <section id="about" className="bg-[#EBEBEB] py-24 overflow-hidden relative" ref={ref}>
            {/* Ghost arc left edge */}
            <div className="absolute -left-20 bottom-10 w-56 h-56 rounded-full border border-gray-300/50 pointer-events-none" />

            <div className="max-w-[1300px] mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">

                {/* ── LEFT: overlapping images ── */}
                <div className={`relative h-[480px] md:h-[540px] transition-all duration-1000 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}`}>
                    {/* Main large image — right-aligned, full height */}
                    <div className="absolute right-0 top-0 w-[75%] h-full rounded-sm overflow-hidden shadow-lg">
                        <img
                            src="https://html.ravextheme.com/redox/light/assets/imgs/web-development/hero-img-5.webp"
                            alt="Team collaboration"
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                    {/* Small image — overlaps bottom-left */}
                    <div
                        className={`absolute left-0 bottom-10 w-[46%] h-[54%] rounded-sm overflow-hidden shadow-xl border-4 border-[#EBEBEB] transition-all duration-1000 delay-200 ${
                            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                    >
                        <img
                            src="https://html.ravextheme.com/redox/light/assets/imgs/web-development/about-img-7.webp"
                            alt="Team detail"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* ── RIGHT: content ── */}
                <div className={`transition-all duration-1000 delay-150 ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}>

                    {/* Label with blue line */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-[3px] bg-[#4353FF]" />
                        <span className="font-body font-semibold text-[#4353FF] text-xs uppercase tracking-[0.2em]">About Our Company</span>
                    </div>

                    {/* Heading — bold, all caps, matches screenshot */}
                    <h2
                        className="font-heading font-black text-[#0f0f0f] uppercase leading-[1.0] tracking-tight mb-6"
                        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
                    >
                        WE WANT TO BRING BUSINESS<br />
                        AND THE DIGITAL WORLD<br />
                        TOGETHER
                    </h2>

                    {/* Body */}
                    <p className="font-body text-gray-500 leading-relaxed text-[15px] mb-10 max-w-[500px]">
                        This is the main factor that sets us apart from our competition and allows us to
                        deliver a specialist business consultancy service. Through our years of experience,
                        we've also learned that while each channel has its own set of advantages, they all
                        work best when strategically paired with other channels.
                    </p>

                    {/* Stats row with blue outline icons */}
                    <div className="flex items-start gap-10 mb-10">
                        {/* Stat 1 */}
                        <div className={`flex items-center gap-4 transition-all duration-700 delay-400 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                            <div className="w-14 h-14 flex-shrink-0">
                                <svg viewBox="0 0 56 56" fill="none" className="w-full h-full">
                                    <circle cx="28" cy="28" r="27" stroke="#4353FF" strokeWidth="1.5" opacity="0.3"/>
                                    <path d="M28 14 C22 14 17 19 17 25 C17 31 21 35 26 37 L28 42 L30 37 C35 35 39 31 39 25 C39 19 34 14 28 14Z" stroke="#4353FF" strokeWidth="1.5" fill="none"/>
                                    <circle cx="28" cy="25" r="4" stroke="#4353FF" strokeWidth="1.5" fill="none"/>
                                    <path d="M20 44 Q28 40 36 44" stroke="#4353FF" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                                </svg>
                            </div>
                            <div>
                                <p className="font-heading font-black text-[#0f0f0f] text-3xl leading-none">
                                    <Counter target={25} />
                                </p>
                                <p className="font-body text-gray-400 text-sm mt-1">Years on the market</p>
                            </div>
                        </div>

                        {/* Stat 2 */}
                        <div className={`flex items-center gap-4 transition-all duration-700 delay-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                            <div className="w-14 h-14 flex-shrink-0">
                                <svg viewBox="0 0 56 56" fill="none" className="w-full h-full">
                                    <circle cx="28" cy="28" r="27" stroke="#4353FF" strokeWidth="1.5" opacity="0.3"/>
                                    <rect x="16" y="14" width="18" height="24" rx="1.5" stroke="#4353FF" strokeWidth="1.5" fill="none"/>
                                    <path d="M34 18 L40 18 L40 38 L22 38" stroke="#4353FF" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                                    <circle cx="26" cy="20" r="3" stroke="#4353FF" strokeWidth="1.5" fill="none"/>
                                    <path d="M20 26 L28 26 M20 30 L28 30" stroke="#4353FF" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <div>
                                <p className="font-heading font-black text-[#0f0f0f] text-3xl leading-none">
                                    <Counter target={375} />
                                </p>
                                <p className="font-body text-gray-400 text-sm mt-1">Projects delivered so far</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <a
                        href="#services"
                        className="inline-flex items-center gap-3 bg-[#4353FF] text-white font-body font-semibold px-7 py-4 hover:bg-[#0f0f0f] transition-all duration-300 group relative overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-[#0f0f0f] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-400" />
                        <span className="relative">Get Started Now</span>
                        <span className="relative group-hover:rotate-45 transition-transform duration-300">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2h10v10M2 12L12 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
                    </a>
                </div>
            </div>
        </section>
    );
}