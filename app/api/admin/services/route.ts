import { NextRequest, NextResponse } from "next/server";
import { db, services } from "@/db";
import { getSession } from "@/lib/auth";
import { asc } from "drizzle-orm";

export async function GET() {
    const items = await db.select().from(services).orderBy(asc(services.order));
    return NextResponse.json({ services: items });
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const [item] = await db.insert(services).values(body).returning();
    return NextResponse.json({ success: true, service: item });
}