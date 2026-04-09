import { NextRequest, NextResponse } from "next/server";
import { db, blogPosts } from "@/db";
import { requirePermission } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const postSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
    excerpt: z.string().optional(),
    content: z.string().min(1),
    image: z.string().optional().nullable(),
    categoryId: z.string().uuid(),
    published: z.boolean().default(false),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const { forbidden } = await requirePermission("blog.edit");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const body = await req.json();
        const parsed = postSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

        const publishPerm = await requirePermission("blog.publish");
        const canPublish = !publishPerm.forbidden;
        const updateData = {
            ...parsed.data,
            updatedAt: new Date(),
            ...(canPublish ? {} : { published: false }), // Force false if lacking publish perm
        };

        const [post] = await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, params.id)).returning();
        if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
        return NextResponse.json({ post });
    } catch (err: any) {
        if (err.code === "23505") return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { forbidden } = await requirePermission("blog.delete");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const [post] = await db.delete(blogPosts).where(eq(blogPosts.id, params.id)).returning();
        if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
