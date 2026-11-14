"use client";
// app/(main)/template.tsx
// Fallback page transition: after a client-side navigation, the new page fades
// in over 240 ms. Skipped on the first page load (nothing to transition from)
// and while a view transition is already cross-fading (lib/view-transition.tsx).
import { useState } from "react";
import { viewTransitionActive } from "@/lib/view-transition";

let hasRenderedOnce = false;

export default function Template({ children }: { children: React.ReactNode }) {
    const [fade] = useState(() => {
        if (typeof window === "undefined") return false; // server render: never fade
        const shouldFade = hasRenderedOnce && !viewTransitionActive;
        hasRenderedOnce = true;
        return shouldFade;
    });
    return <div className={fade ? "page-fade-in" : undefined}>{children}</div>;
}
