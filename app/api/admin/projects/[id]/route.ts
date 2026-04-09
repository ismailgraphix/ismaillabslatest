// app/api/admin/projects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requirePermission } from "@/lib/auth"; // ✅ correct path, correct export

interface Params { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Params) {
    const { forbidden } = await requirePermission("projects.edit");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const body = await req.json();
        const { title, description, image, techStack, type, link, published, order } = body;

        const [updated] = await db.update(projects).set({
            ...(title !== undefined && { title: title.trim() }),
            ...(description !== undefined && { description: description?.trim() ?? null }),
            ...(image !== undefined && { image: image?.trim() ?? null }),
            ...(techStack !== undefined && { techStack: Array.isArray(techStack) ? techStack : [] }),
            ...(type !== undefined && { type }),
            ...(link !== undefined && { link: link?.trim() ?? null }),
            ...(published !== undefined && { published }),
            ...(order !== undefined && { order }),
            updatedAt: new Date(),
        })
            .where(eq(projects.id, params.id))
            .returning();

        if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ project: updated });
    } catch (err) {
        console.error("[projects PATCH]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const { forbidden } = await requirePermission("projects.delete");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const [deleted] = await db.delete(projects)
            .where(eq(projects.id, params.id))
            .returning();

        if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[projects DELETE]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}