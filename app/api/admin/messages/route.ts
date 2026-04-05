import { NextRequest, NextResponse } from "next/server";
import { db, messages } from "@/db";
import { getSession } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    subject: z.string().optional(),
    message: z.string().min(1),
});

// Public: submit contact form
export async function POST(req: NextRequest) {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
        const message = parsed.error.issues[0]?.message ?? "Invalid input";
        return NextResponse.json({ error: message }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const [msg] = await db.insert(messages).values({ ...parsed.data, ipAddress: ip, status: "unread" }).returning();
    return NextResponse.json({ success: true, id: msg.id });
}

// Admin: get all messages
export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const allMessages = await db.select().from(messages).orderBy(desc(messages.createdAt));
    return NextResponse.json({ messages: allMessages });
}