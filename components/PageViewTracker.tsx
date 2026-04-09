// components/PageViewTracker.tsx
"use client";
import { usePageView } from "@/hooks/usePageView";

export function PageViewTracker() {
    usePageView();
    return null;
}