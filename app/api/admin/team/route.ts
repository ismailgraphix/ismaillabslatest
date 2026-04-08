import { NextRequest, NextResponse } from "next/server";
import { db, teamMembers } from "@/db";
import { requirePermission } from "@/lib/auth";
import { asc } from "drizzle-orm";

export async function GET() {
    const { forbidden } = await requirePermission("team.view");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const members = await db.select().from(teamMembers).orderBy(asc(teamMembers.order));
    return NextResponse.json({ members });
}

export async function POST(req: NextRequest) {
    const { forbidden } = await requirePermission("team.create");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const body = await req.json();
    const [member] = await db.insert(teamMembers).values(body).returning();
    return NextResponse.json({ success: true, member });
}