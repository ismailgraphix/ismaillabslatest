import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db, users } from "@/db";
import { eq } from "drizzle-orm";

import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
    const session = await getSession();
    if (!session) redirect("/admin/login");

    const perms = (session.permissions as string[]) || [];

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, session.userId))
        .limit(1);

    if (!user) redirect("/admin/login");

    return (
        <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">


            <main className="flex-1 overflow-y-auto">
                <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="font-heading font-black text-white text-xl uppercase tracking-tight">Your Profile</h1>
                        <p className="font-body text-gray-500 text-xs mt-0.5">
                            Manage your personal details and avatar
                        </p>
                    </div>
                </div>

                <div className="p-8 max-w-2xl">
                    <ProfileForm user={user} />
                </div>
            </main>
        </div>
    );
}
