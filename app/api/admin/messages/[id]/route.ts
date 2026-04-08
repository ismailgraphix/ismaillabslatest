import { NextRequest, NextResponse } from "next/server";
import { db, messages } from "@/db";
import { requirePermission } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { forbidden } = await requirePermission("messages.view");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const body = await req.json();
    await db.update(messages).set(body).where(eq(messages.id, id));
    return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { forbidden } = await requirePermission("messages.delete");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    await db.delete(messages).where(eq(messages.id, id));
    return NextResponse.json({ success: true });
}