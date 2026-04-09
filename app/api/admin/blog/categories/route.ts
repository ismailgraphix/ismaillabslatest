import { NextRequest, NextResponse } from "next/server";
import { db, blogCategories } from "@/db";
import { requirePermission } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

const categorySchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
});

export async function GET() {
    // Open to anyone with blog.view
    const { forbidden } = await requirePermission("blog.view");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const all = await db.select().from(blogCategories).orderBy(desc(blogCategories.createdAt));
    return NextResponse.json({ categories: all });
}

export async function POST(req: NextRequest) {
    // Requires blog.create
    const { forbidden } = await requirePermission("blog.create");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const body = await req.json();
        const parsed = categorySchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const [cat] = await db.insert(blogCategories).values({
            name: parsed.data.name,
            slug: parsed.data.slug,
        }).returning();

        return NextResponse.json({ category: cat });
    } catch (err: any) {
        if (err.code === "23505") {
            return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
