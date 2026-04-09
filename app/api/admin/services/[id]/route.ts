import { NextRequest, NextResponse } from "next/server";
import { db, services } from "@/db";
import { requirePermission } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const serviceSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
    description: z.string().optional(),
    content: z.string().optional(),
    icon: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    order: z.number().default(0),
    published: z.boolean().default(false),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const { forbidden } = await requirePermission("services.edit"); 
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const body = await req.json();
        const parsed = serviceSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

        const [updated] = await db.update(services)
            .set(parsed.data)
            .where(eq(services.id, params.id))
            .returning();
            
        if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ service: updated });
    } catch (err: any) {
        if (err.code === "23505") return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
        return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { forbidden } = await requirePermission("services.delete");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await db.delete(services).where(eq(services.id, params.id));
    return NextResponse.json({ success: true });
}