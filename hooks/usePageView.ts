// hooks/usePageView.ts
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Add whatever public paths you want tracked here
// "/about" replaced "/portfolio" (which now redirects there), so the same two pages are tracked as before.
const TRACKED_PATHS = ["/", "/about"];

export function usePageView() {
    const pathname = usePathname();

    useEffect(() => {
        if (!TRACKED_PATHS.includes(pathname)) return; // ignore everything else

        fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: pathname }),
        }).catch(() => { });
    }, [pathname]);
}