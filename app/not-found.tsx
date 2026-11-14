// app/not-found.tsx
// Shown for any address that matches no route. It sits outside the (main)
// route group, so it adds the public header and footer itself.
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFoundView from "@/components/NotFoundView";
import { hasEnoughPosts } from "@/lib/queries";

export const metadata: Metadata = {
    title: "Page not found",
    robots: { index: false },
};

export default async function NotFound() {
    return (
        <>
            <Navbar showNotes={await hasEnoughPosts()} />
            <NotFoundView />
            <Footer />
        </>
    );
}
