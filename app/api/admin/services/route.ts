import { NextRequest, NextResponse } from "next/server";
import { db, services } from "@/db";
import { requirePermission } from "@/lib/auth";
import { desc, eq, asc } from "drizzle-orm";
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

export async function GET() {
    // Assuming you have a 'services.view' permission, or falling back to general admin
    const { forbidden } = await requirePermission("services.view"); 
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const all = await db.select().from(services).orderBy(asc(services.order));
    return NextResponse.json({ services: all });
}

export async function POST(req: NextRequest) {
    const { forbidden } = await requirePermission("services.create");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const body = await req.json();
        const parsed = serviceSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid data", details: parsed.error }, { status: 400 });
        }

        const [service] = await db.insert(services).values(parsed.data).returning();
        return NextResponse.json({ service });
    } catch (err: any) {
        if (err.code === "23505") {
            return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
    }
}