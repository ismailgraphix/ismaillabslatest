import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ismail Labs Admin",
    description: "Admin panel",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <div className="theme-admin-scope min-h-dvh">{children}</div>;
}
