import { NextRequest, NextResponse } from "next/server";
import { db, clients } from "@/db";
import { requirePermission } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
    const { forbidden } = await requirePermission("clients.view");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const all = await db.select().from(clients).orderBy(desc(clients.createdAt));
    return NextResponse.json({ clients: all });
}

export async function POST(req: NextRequest) {
    const { forbidden } = await requirePermission("clients.create");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const body = await req.json();
    const [client] = await db.insert(clients).values(body).returning();
    return NextResponse.json({ success: true, client });
}