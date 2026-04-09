// hooks/usePageView.ts
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function usePageView() {
    const pathname = usePathname();

    useEffect(() => {
        // Fire and forget — don't await, don't block anything
        fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: pathname }),
        }).catch(() => { }); // silently ignore any network errors
    }, [pathname]);
}