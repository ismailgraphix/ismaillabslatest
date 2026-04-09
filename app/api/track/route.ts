// app/api/track/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pageViews } from "@/db/schema";

async function getCountryFromIp(ip: string): Promise<string | null> {
    // Skip private / loopback addresses (during local dev these return "Local")
    if (
        ip === "::1" ||
        ip === "127.0.0.1" ||
        ip.startsWith("192.168.") ||
        ip.startsWith("10.") ||
        ip.startsWith("172.")
    ) {
        return "Local";
    }

    try {
        const res = await fetch(`http://ip-api.com/json/${ip}?fields=country,status`, {
            // Cache the result per IP for 24 hours so we don't hammer the free API
            next: { revalidate: 86400 },
        });
        const data = await res.json();
        if (data.status === "success") return data.country as string;
        return null;
    } catch {
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const { path } = await req.json();
        if (!path || typeof path !== "string") {
            return NextResponse.json({ error: "Invalid path" }, { status: 400 });
        }

        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
            req.headers.get("x-real-ip") ??
            null;

        const userAgent = req.headers.get("user-agent") ?? null;
        const referrer = req.headers.get("referer") ?? null;
        const country = ip ? await getCountryFromIp(ip) : null;

        await db.insert(pageViews).values({ path, ip, userAgent, referrer, country });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[track POST]", err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}