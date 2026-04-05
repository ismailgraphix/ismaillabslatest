import { NextRequest, NextResponse } from "next/server";
import { db, clients } from "@/db";
import { getSession } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const all = await db.select().from(clients).orderBy(desc(clients.createdAt));
    return NextResponse.json({ clients: all });
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const [client] = await db.insert(clients).values(body).returning();
    return NextResponse.json({ success: true, client });
}