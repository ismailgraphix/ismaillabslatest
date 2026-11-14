import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async function SettingsPage() {
    const session = await getSession();
    if (!session) redirect("/admin/login");
    return (
        <div className="p-8">
            <h1 className="font-heading font-black text-[var(--text)] text-xl uppercase tracking-tight mb-2">Settings</h1>
            <p className="font-body text-[var(--text-faint)] text-sm mb-8">Site configuration and admin preferences</p>
            <div className="border border-dashed border-[var(--border)] rounded-lg py-20 text-center">
                <p className="font-body text-[var(--text-faint)] text-sm">⚙️ Settings panel coming soon</p>
                <p className="font-body text-[var(--text-faint)] text-xs mt-2">Site name, social links, SEO settings, SMTP config...</p>
            </div>
        </div>
    );
}