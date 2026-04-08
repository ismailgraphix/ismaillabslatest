import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/db";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || !["super_admin", "admin"].includes(session.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // Only super_admin can grant users.* and settings.* permissions
    const { id } = await params;
    const { permissions } = await req.json();

    // Non-super_admins cannot grant permissions they don't have
    if (session.role !== "super_admin") {
        const restricted = ["users.view","users.create","users.edit","users.delete","settings.view","settings.edit"];
        const hasRestricted = permissions.some((p: string) => restricted.includes(p));
        if (hasRestricted) {
            return NextResponse.json({ error: "Only super admin can grant user/settings permissions." }, { status: 403 });
        }
    }

    await db.update(users)
        .set({ permissions, updatedAt: new Date() })
        .where(eq(users.id, id));

    return NextResponse.json({ success: true });
}