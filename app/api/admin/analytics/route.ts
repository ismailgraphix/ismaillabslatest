// app/api/admin/analytics/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { pageViews } from "@/db/schema";
import { count, gte, sql } from "drizzle-orm";

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const now = new Date();
    const startOf30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startOf7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Total all-time views
    const [{ total }] = await db
        .select({ total: count() })
        .from(pageViews);

    // Views today
    const [{ today }] = await db
        .select({ today: count() })
        .from(pageViews)
        .where(gte(pageViews.createdAt, startOfToday));

    // Views last 30 days
    const [{ month }] = await db
        .select({ month: count() })
        .from(pageViews)
        .where(gte(pageViews.createdAt, startOf30Days));

    // Unique IPs last 30 days (rough unique visitor count)
    const [{ unique }] = await db
        .select({ unique: sql<number>`COUNT(DISTINCT ip)` })
        .from(pageViews)
        .where(gte(pageViews.createdAt, startOf30Days));

    // Daily views for the last 7 days (for the chart)
    const daily = await db
        .select({
            date: sql<string>`TO_CHAR(created_at, 'YYYY-MM-DD')`,
            views: count(),
        })
        .from(pageViews)
        .where(gte(pageViews.createdAt, startOf7Days))
        .groupBy(sql`TO_CHAR(created_at, 'YYYY-MM-DD')`)
        .orderBy(sql`TO_CHAR(created_at, 'YYYY-MM-DD')`);

    // Top pages (last 30 days)
    const topPages = await db
        .select({
            path: pageViews.path,
            views: count(),
        })
        .from(pageViews)
        .where(gte(pageViews.createdAt, startOf30Days))
        .groupBy(pageViews.path)
        .orderBy(sql`count(*) desc`)
        .limit(8);

    // Top referrers (last 30 days)
    const topReferrers = await db
        .select({
            referrer: pageViews.referrer,
            visits: count(),
        })
        .from(pageViews)
        .where(gte(pageViews.createdAt, startOf30Days))
        .groupBy(pageViews.referrer)
        .orderBy(sql`count(*) desc`)
        .limit(6);

    return NextResponse.json({
        stats: { total, today, month, unique },
        daily,
        topPages,
        topReferrers,
    });
}