import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "IsmailLabs Admin",
    description: "Admin panel",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
