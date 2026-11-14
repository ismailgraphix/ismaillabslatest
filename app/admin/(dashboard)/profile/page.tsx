import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db, users } from "@/db";
import { eq } from "drizzle-orm";

import ProfileForm from "./ProfileForm";
import PageHeader from "@/components/admin/PageHeader";

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
        <>
            <PageHeader title="Your Profile" subtitle="Manage your personal details and avatar" />
            <div className="p-8 max-w-2xl">
                <ProfileForm user={user} />
            </div>
        </>
    );
}
