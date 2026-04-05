import { NextRequest, NextResponse } from "next/server";
import { db, clients } from "@/db";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const body = await req.json();
    const [c] = await db.update(clients).set({ ...body, updatedAt: new Date() }).where(eq(clients.id, id)).returning();
    return NextResponse.json({ success: true, client: c });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await db.delete(clients).where(eq(clients.id, id));
    return NextResponse.json({ success: true });
}