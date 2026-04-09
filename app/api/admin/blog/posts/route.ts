import { NextRequest, NextResponse } from "next/server";
import { db, blogPosts, users, blogCategories } from "@/db";
import { requirePermission } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";
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

export async function GET() {
    const { forbidden } = await requirePermission("blog.view");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const all = await db
        .select({
            post: blogPosts,
            author: { name: users.name },
            category: { name: blogCategories.name }
        })
        .from(blogPosts)
        .leftJoin(users, eq(users.id, blogPosts.authorId))
        .leftJoin(blogCategories, eq(blogCategories.id, blogPosts.categoryId))
        .orderBy(desc(blogPosts.createdAt));

    return NextResponse.json({ posts: all });
}

export async function POST(req: NextRequest) {
    const { forbidden, user } = await requirePermission("blog.create");
    if (forbidden || !user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const body = await req.json();
        const parsed = postSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid data", details: parsed.error }, { status: 400 });
        }

        // Only explicitly grant published state if the user has publish permission
        const publishPerm = await requirePermission("blog.publish");
        const canPublish = !publishPerm.forbidden;
        const finalPublishedStatus = canPublish ? parsed.data.published : false;

        const [post] = await db.insert(blogPosts).values({
            ...parsed.data,
            published: finalPublishedStatus,
            authorId: user.userId,
        }).returning();

        return NextResponse.json({ post });
    } catch (err: any) {
        if (err.code === "23505") {
            return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
