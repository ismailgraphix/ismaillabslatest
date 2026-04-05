import { NextRequest, NextResponse } from "next/server";
import { db, teamMembers } from "@/db";
import { getSession } from "@/lib/auth";
import { asc } from "drizzle-orm";

export async function GET() {
    const members = await db.select().from(teamMembers).orderBy(asc(teamMembers.order));
    return NextResponse.json({ members });
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const [member] = await db.insert(teamMembers).values(body).returning();
    return NextResponse.json({ success: true, member });
}