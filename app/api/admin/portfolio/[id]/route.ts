import { NextRequest, NextResponse } from "next/server";
import { db, portfolioItems } from "@/db";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const body = await req.json();
    const [item] = await db.update(portfolioItems).set({ ...body, updatedAt: new Date() }).where(eq(portfolioItems.id, id)).returning();
    return NextResponse.json({ success: true, item });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
    return NextResponse.json({ success: true });
}