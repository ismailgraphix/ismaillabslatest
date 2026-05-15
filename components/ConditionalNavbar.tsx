// components/ConditionalNavbar.tsx
"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
    const pathname = usePathname();
    if (pathname.startsWith("/portfolio")) return null;
    return <Navbar />;
}