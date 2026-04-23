import { NextResponse } from "next/server";
import { db, portfolioItems } from "@/db";
import { eq, asc } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const items = await db.select().from(portfolioItems)
            .where(eq(portfolioItems.published, true))
            .orderBy(asc(portfolioItems.order));
        return NextResponse.json({ items });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
