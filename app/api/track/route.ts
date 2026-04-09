// app/api/track/route.ts
// This is a PUBLIC route — no auth required, it just records page visits
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pageViews } from "@/db/schema";

export async function POST(req: NextRequest) {
    try {
        const { path } = await req.json();
        if (!path || typeof path !== "string") {
            return NextResponse.json({ error: "Invalid path" }, { status: 400 });
        }

        // Get IP — works on Vercel and most hosts
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
            req.headers.get("x-real-ip") ??
            null;

        const userAgent = req.headers.get("user-agent") ?? null;
        const referrer = req.headers.get("referer") ?? null;

        await db.insert(pageViews).values({ path, ip, userAgent, referrer });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[track POST]", err);
        // Silently fail — never break the user's page because of analytics
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}