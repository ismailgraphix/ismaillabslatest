import { NextRequest, NextResponse } from "next/server";
import { db, messages } from "@/db";
import { getSession, requirePermission } from "@/lib/auth";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email";

// Limits match the database columns (name and email are varchar(255), subject
// varchar(500)), so an over-long value is a clear 400, never a failed insert.
const contactSchema = z.object({
    name: z.string().trim().min(1, "Please enter your name.").max(120, "Please keep your name under 120 characters."),
    email: z.string().trim().max(254, "That email address is too long.").email("Please enter a valid email address."),
    subject: z.string().trim().max(300, "The subject is too long.").optional(),
    message: z.string().trim().min(1, "Please write a message.").max(5000, "Please keep the message under 5,000 characters."),
    // Honeypot: a field people never see. Bots that fill every input fill this one.
    website: z.string().optional(),
});

// At most this many messages from one address in the window below.
const RATE_LIMIT = 3;
const RATE_WINDOW = "10 minutes";

// PUBLIC: submit contact form (no auth needed)
export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
        return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
    }
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
        // Field-level messages, so the form can show each one under its field.
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
            const key = String(issue.path[0] ?? "form");
            fieldErrors[key] ??= issue.message;
        }
        const first = parsed.error.issues[0]?.message ?? "Please check the form and try again.";
        return NextResponse.json({ error: first, fieldErrors }, { status: 400 });
    }

    const { website, ...data } = parsed.data;

    // A filled honeypot gets the normal success reply, so the bot learns nothing, and is not stored.
    if (website && website.trim() !== "") {
        return NextResponse.json({ success: true });
    }

    // The visitor's address is the first entry of x-forwarded-for (the rest are proxies).
    const ip = (req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown").slice(0, 50);

    try {
        if (ip !== "unknown") {
            const [recent] = await db
                .select({ n: count() })
                .from(messages)
                .where(and(eq(messages.ipAddress, ip), sql`${messages.createdAt} > now() - interval '${sql.raw(RATE_WINDOW)}'`));
            if ((recent?.n ?? 0) >= RATE_LIMIT) {
                return NextResponse.json(
                    { error: "You have sent several messages in a short time. Please wait a few minutes, or email us directly." },
                    { status: 429, headers: { "Retry-After": "600" } },
                );
            }
        }

        const [msg] = await db.insert(messages).values({ ...data, ipAddress: ip, status: "unread" }).returning();

        // The message is safe in the inbox now; the email is a notification on top.
        await sendContactEmail({ name: data.name, email: data.email, subject: data.subject ?? "", message: data.message });

        return NextResponse.json({ success: true, id: msg.id });
    } catch (err) {
        console.error("[messages POST]", err);
        return NextResponse.json({ error: "The message could not be saved. Please try again, or email us directly." }, { status: 500 });
    }
}

// PROTECTED: get messages — requires messages.view
export async function GET() {
    const { forbidden } = await requirePermission("messages.view");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const all = await db.select().from(messages).orderBy(desc(messages.createdAt));
    return NextResponse.json({ messages: all });
}