import { NextRequest, NextResponse } from "next/server";
import { db, messages } from "@/db";
import { getSession, requirePermission } from "@/lib/auth";
import { desc } from "drizzle-orm";
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    subject: z.string().optional(),
    message: z.string().min(1),
});

// PUBLIC: submit contact form (no auth needed)
export async function POST(req: NextRequest) {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const [msg] = await db.insert(messages).values({ ...parsed.data, ipAddress: ip, status: "unread" }).returning();
    return NextResponse.json({ success: true, id: msg.id });
}

// PROTECTED: get messages — requires messages.view
export async function GET() {
    const { forbidden } = await requirePermission("messages.view");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const all = await db.select().from(messages).orderBy(desc(messages.createdAt));
    return NextResponse.json({ messages: all });
}