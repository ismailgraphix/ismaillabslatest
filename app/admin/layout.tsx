import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "IsmailLabs Admin",
    description: "Admin panel",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen bg-[#0f0f0f]">{children}</div>;
}