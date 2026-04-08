import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/db";
import { requirePermission, getSessionUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { forbidden } = await requirePermission("users.view");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const [user] = await db.select({
        id: users.id, name: users.name, email: users.email,
        role: users.role, status: users.status, permissions: users.permissions,
        createdAt: users.createdAt, lastLoginAt: users.lastLoginAt,
    }).from(users).where(eq(users.id, id)).limit(1);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { forbidden, user: editor } = await requirePermission("users.edit");
    if (forbidden || !editor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const body = await req.json();

    // Can't edit super_admin unless you ARE super_admin
    const [target] = await db.select({ role: users.role }).from(users).where(eq(users.id, id)).limit(1);
    if (target?.role === "super_admin" && editor.role !== "super_admin") {
        return NextResponse.json({ error: "Cannot edit super admin" }, { status: 403 });
    }

    await db.update(users).set({ ...body, updatedAt: new Date() }).where(eq(users.id, id));
    return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { forbidden, user: deleter } = await requirePermission("users.delete");
    if (forbidden || !deleter) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;

    // Cannot delete yourself
    if (id === deleter.userId) return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });

    const [target] = await db.select({ role: users.role }).from(users).where(eq(users.id, id)).limit(1);
    if (target?.role === "super_admin") {
        return NextResponse.json({ error: "Cannot delete super admin" }, { status: 403 });
    }

    await db.delete(users).where(eq(users.id, id));
    return NextResponse.json({ success: true });
}