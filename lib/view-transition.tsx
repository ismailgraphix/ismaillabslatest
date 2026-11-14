"use client";
// lib/view-transition.tsx
// Shared-element page transitions for Next.js 14, which has no built-in
// support for the View Transitions API (that arrived, experimentally, in 15.2).
//
// A link that opts in (TransitionLink) wraps its navigation in
// document.startViewTransition(). The update callback resolves once the new
// route has rendered, which ViewTransitionProvider detects through a pathname
// change. The clicked element gets the view-transition-name "work-hero" for the
// duration, and the case-study header image carries the same name, so the
// browser morphs one into the other while the rest of the page cross-fades
// (timings in app/globals.css).
//
// Browsers without the API, and visitors who ask for reduced motion, get a
// plain navigation; app/(main)/template.tsx then fades the new page in.
import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { SHARED_NAME } from "@/lib/view-transition-name";

/** True while a view transition is running, so the template's fallback fade stays out of its way. */
export let viewTransitionActive = false;

type Navigate = (href: string, shared?: HTMLElement | null) => void;
const NavigateContext = createContext<Navigate | null>(null);

export function ViewTransitionProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const resolveRef = useRef<(() => void) | null>(null);

    // The new route has committed: let the browser take the "after" snapshot.
    useEffect(() => {
        const resolve = resolveRef.current;
        if (!resolve) return;
        resolveRef.current = null;
        requestAnimationFrame(() => resolve());
    }, [pathname]);

    const navigate = useCallback<Navigate>(
        (href, shared) => {
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (typeof document.startViewTransition !== "function" || reduced) {
                router.push(href);
                return;
            }

            if (shared) shared.style.viewTransitionName = SHARED_NAME;
            viewTransitionActive = true;

            const transition = document.startViewTransition(
                () =>
                    new Promise<void>((resolve) => {
                        resolveRef.current = resolve;
                        router.push(href);
                        // Never leave the page frozen: give up on the morph after 3 s.
                        window.setTimeout(() => {
                            if (resolveRef.current === resolve) {
                                resolveRef.current = null;
                                resolve();
                            }
                        }, 3000);
                    }),
            );
            transition.finished.finally(() => {
                if (shared) shared.style.viewTransitionName = "";
                viewTransitionActive = false;
            });
        },
        [router],
    );

    return <NavigateContext.Provider value={navigate}>{children}</NavigateContext.Provider>;
}

/**
 * A Next.js Link whose plain left-click navigates inside a view transition,
 * morphing the element matched by `sharedSelector` (inside the link) into the
 * element named SHARED_NAME on the next page. Modified clicks (new tab, etc.)
 * behave as normal links.
 */
export function TransitionLink({
    href,
    sharedSelector,
    className,
    children,
}: {
    href: string;
    sharedSelector?: string;
    className?: string;
    children: React.ReactNode;
}) {
    const navigate = useContext(NavigateContext);

    function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
        if (!navigate || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        const shared = sharedSelector ? e.currentTarget.querySelector<HTMLElement>(sharedSelector) : null;
        navigate(href, shared);
    }

    return (
        <Link href={href} className={className} onClick={onClick}>
            {children}
        </Link>
    );
}
