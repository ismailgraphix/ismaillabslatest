import { NextRequest, NextResponse } from "next/server";
import { db, portfolioItems } from "@/db";
import { getSession } from "@/lib/auth";
import { eq, asc } from "drizzle-orm";

export async function GET() {
    const items = await db.select().from(portfolioItems).orderBy(asc(portfolioItems.order));
    return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const [item] = await db.insert(portfolioItems).values(body).returning();
    return NextResponse.json({ success: true, item });
}