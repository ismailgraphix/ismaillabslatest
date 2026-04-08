import { NextRequest, NextResponse } from "next/server";
import { db, services } from "@/db";
import { requirePermission } from "@/lib/auth";
import { asc } from "drizzle-orm";

export async function GET() {
    const { forbidden } = await requirePermission("services.view");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const items = await db.select().from(services).orderBy(asc(services.order));
    return NextResponse.json({ services: items });
}

export async function POST(req: NextRequest) {
    const { forbidden } = await requirePermission("services.create");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const body = await req.json();
    const [item] = await db.insert(services).values(body).returning();
    return NextResponse.json({ success: true, service: item });
}