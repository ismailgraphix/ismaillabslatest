import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";

export default async function BlogPage() {
    const session = await getSession();
    if (!session) redirect("/admin/login");
    return (
        <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
            <Sidebar userName={session.name} userRole={session.role} userEmail={session.email} />
            <main className="flex-1 overflow-y-auto p-8">
                <h1 className="font-heading font-black text-white text-xl uppercase tracking-tight mb-2">Blog</h1>
                <p className="font-body text-gray-500 text-sm mb-8">Manage blog posts shown on the site</p>
                <div className="border border-dashed border-white/10 py-20 text-center">
                    <p className="font-body text-gray-600 text-sm">✍️ Blog editor coming soon</p>
                    <p className="font-body text-gray-700 text-xs mt-2">Rich text editor, categories, tags, publish scheduling...</p>
                </div>
            </main>
        </div>
    );
}