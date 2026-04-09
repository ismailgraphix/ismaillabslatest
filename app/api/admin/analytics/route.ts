// app/api/admin/analytics/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { pageViews } from "@/db/schema";
import { count, gte, sql, isNotNull } from "drizzle-orm";

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const now = new Date();
    const start30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const start7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [{ total }] = await db
        .select({ total: count() })
        .from(pageViews);

    const [{ today }] = await db
        .select({ today: count() })
        .from(pageViews)
        .where(gte(pageViews.createdAt, startOfToday));

    const [{ month }] = await db
        .select({ month: count() })
        .from(pageViews)
        .where(gte(pageViews.createdAt, start30Days));

    const [{ unique }] = await db
        .select({ unique: sql<number>`COUNT(DISTINCT ip)` })
        .from(pageViews)
        .where(gte(pageViews.createdAt, start30Days));

    // Daily views — last 7 days
    const daily = await db
        .select({
            date: sql<string>`TO_CHAR(created_at, 'YYYY-MM-DD')`,
            views: count(),
        })
        .from(pageViews)
        .where(gte(pageViews.createdAt, start7Days))
        .groupBy(sql`TO_CHAR(created_at, 'YYYY-MM-DD')`)
        .orderBy(sql`TO_CHAR(created_at, 'YYYY-MM-DD')`);

    // Top pages — last 30 days
    const topPages = await db
        .select({ path: pageViews.path, views: count() })
        .from(pageViews)
        .where(gte(pageViews.createdAt, start30Days))
        .groupBy(pageViews.path)
        .orderBy(sql`count(*) desc`)
        .limit(8);

    // Top referrers — last 30 days
    const topReferrers = await db
        .select({ referrer: pageViews.referrer, visits: count() })
        .from(pageViews)
        .where(gte(pageViews.createdAt, start30Days))
        .groupBy(pageViews.referrer)
        .orderBy(sql`count(*) desc`)
        .limit(6);

    // Top countries — last 30 days
    const topCountries = await db
        .select({ country: pageViews.country, visits: count() })
        .from(pageViews)
        .where(gte(pageViews.createdAt, start30Days))
        .groupBy(pageViews.country)
        .orderBy(sql`count(*) desc`)
        .limit(8);

    return NextResponse.json({
        stats: { total, today, month, unique },
        daily,
        topPages,
        topReferrers,
        topCountries,
    });
}