// app/api/admin/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc } from "drizzle-orm";
import { requirePermission } from "@/lib/auth"; // ✅ correct path, correct export

export async function GET(req: NextRequest) {
    const { forbidden } = await requirePermission("projects.view");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const all = await db.select().from(projects).orderBy(desc(projects.createdAt));
        return NextResponse.json({ projects: all });
    } catch (err) {
        console.error("[projects GET]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { forbidden } = await requirePermission("projects.create");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const body = await req.json();
        const { title, description, image, techStack, type, link, published, order } = body;

        if (!title?.trim()) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const [created] = await db.insert(projects).values({
            title: title.trim(),
            description: description?.trim() ?? null,
            image: image?.trim() ?? null,
            techStack: Array.isArray(techStack) ? techStack : [],
            type: type ?? "web",
            link: link?.trim() ?? null,
            published: published ?? false,
            order: order ?? 0,
        }).returning();

        return NextResponse.json({ project: created }, { status: 201 });
    } catch (err) {
        console.error("[projects POST]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}