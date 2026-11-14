// app/api/site-index/route.ts
// PUBLIC, read-only: the titles and slugs of published projects and services,
// for the command palette (components/CommandPalette.tsx). Nothing else is exposed.
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { getPublishedServices, getWork } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
    noStore();
    try {
        const [work, services] = await Promise.all([getWork(), getPublishedServices()]);
        return NextResponse.json({
            work: work.map((p) => ({ title: p.title, slug: p.slug })),
            services: services.map((s) => ({ title: s.title, slug: s.slug })),
        });
    } catch (err) {
        console.error("[site-index GET]", err);
        return NextResponse.json({ work: [], services: [] }, { status: 500 });
    }
}
