import { NextRequest, NextResponse } from "next/server";
import { db, portfolioItems } from "@/db";
import { requirePermission, getSession } from "@/lib/auth";
import { asc } from "drizzle-orm";

export async function GET() {
    const { forbidden } = await requirePermission("portfolio.view");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const items = await db.select().from(portfolioItems).orderBy(asc(portfolioItems.order));
    return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
    const { forbidden } = await requirePermission("portfolio.create");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const body = await req.json();
    const [item] = await db.insert(portfolioItems).values(body).returning();
    return NextResponse.json({ success: true, item });
}