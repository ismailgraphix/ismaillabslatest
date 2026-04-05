import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/db";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || !["super_admin","admin"].includes(session.role)) return NextResponse.json({ error:"Forbidden" }, { status:403 });
    const { id } = await params;
    const body = await req.json();
    await db.update(users).set({ ...body, updatedAt: new Date() }).where(eq(users.id, id));
    return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== "super_admin") return NextResponse.json({ error:"Forbidden" }, { status:403 });
    const { id } = await params;
    if (id === session.userId) return NextResponse.json({ error:"Cannot delete yourself" }, { status:400 });
    await db.delete(users).where(eq(users.id, id));
    return NextResponse.json({ success: true });
}