import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await getSession();
    if (!user) redirect("/admin/login");

    return (
        <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
            <Sidebar
                userName={user.name}
                userRole={user.role}
                userEmail={user.email}
                userPermissions={(user.permissions as string[]) ?? []}
            />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}