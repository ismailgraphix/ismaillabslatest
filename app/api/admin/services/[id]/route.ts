import { NextRequest, NextResponse } from "next/server";
import { db, services } from "@/db";
import { requirePermission } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { forbidden } = await requirePermission("services.edit");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const body = await req.json();
    const [s] = await db.update(services).set(body).where(eq(services.id, id)).returning();
    return NextResponse.json({ success: true, service: s });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { forbidden } = await requirePermission("services.delete");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    await db.delete(services).where(eq(services.id, id));
    return NextResponse.json({ success: true });
}