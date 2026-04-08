import { NextRequest, NextResponse } from "next/server";
import { db, teamMembers } from "@/db";
import { requirePermission } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { forbidden } = await requirePermission("team.edit");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const body = await req.json();
    const [m] = await db.update(teamMembers).set(body).where(eq(teamMembers.id, id)).returning();
    return NextResponse.json({ success: true, member: m });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { forbidden } = await requirePermission("team.delete");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
    return NextResponse.json({ success: true });
}