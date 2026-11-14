"use client";
// components/RevealObserver.tsx
// Drives the section reveals in app/globals.css ("Section content reveals").
// Mark an element with data-reveal (fades in with an 8 px rise) or a list with
// data-reveal-list (each child does, staggered) and this adds .is-revealed the
// first time it enters the viewport. Each element reveals once.
//
// Content is only hidden after this runs (html.reveal-ready), and anything
// already on screen at that moment is marked revealed first, so nothing
// flickers and the page reads fine without JavaScript. New content (a page
// change, a filtered list) is picked up through a MutationObserver.
import { useEffect } from "react";

const SELECTOR = "[data-reveal]:not(.is-revealed), [data-reveal-list]:not(.is-revealed)";

export default function RevealObserver() {
    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") return;
        const root = document.documentElement;

        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    entry.target.classList.add("is-revealed");
                    io.unobserve(entry.target);
                }
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
        );

        const scan = (revealVisibleNow: boolean) => {
            document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
                if (revealVisibleNow) {
                    const r = el.getBoundingClientRect();
                    if (r.top < window.innerHeight && r.bottom > 0) {
                        el.classList.add("is-revealed");
                        return;
                    }
                }
                io.observe(el);
            });
        };

        // First pass: whatever is on screen now stays put; the rest waits to be scrolled to.
        scan(true);
        root.classList.add("reveal-ready");

        let frame = 0;
        const mo = new MutationObserver(() => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => scan(false));
        });
        mo.observe(document.body, { childList: true, subtree: true });

        return () => {
            io.disconnect();
            mo.disconnect();
            cancelAnimationFrame(frame);
            root.classList.remove("reveal-ready");
        };
    }, []);

    return null;
}
