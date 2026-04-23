import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
    try {
        const data = await db.select()
            .from(projects)
            .where(eq(projects.published, true))
            .orderBy(desc(projects.order), desc(projects.createdAt));
        return NextResponse.json({ items: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
