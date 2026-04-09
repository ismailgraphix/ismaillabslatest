import { NextRequest, NextResponse } from "next/server";
import { db, blogCategories } from "@/db";
import { requirePermission } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { forbidden } = await requirePermission("blog.delete");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        await db.delete(blogCategories).where(eq(blogCategories.id, params.id));
        return NextResponse.json({ success: true });
    } catch (e: any) {
        // Handle foreign key constraint error if category in use
        if (e.code === "23503") {
            return NextResponse.json({ error: "Category is currently in use by a post" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
