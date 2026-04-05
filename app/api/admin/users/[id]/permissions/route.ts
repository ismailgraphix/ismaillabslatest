import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/db";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || !["super_admin","admin"].includes(session.role)) return NextResponse.json({ error:"Forbidden" }, { status:403 });
    const { id } = await params;
    const { permissions } = await req.json();
    await db.update(users).set({ permissions, updatedAt: new Date() }).where(eq(users.id, id));
    return NextResponse.json({ success: true });
}