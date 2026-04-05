import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/db";
import { getSession } from "@/lib/auth";
import { hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const createSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["admin", "editor", "viewer"]),
});

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const allUsers = await db.select({
        id: users.id, name: users.name, email: users.email, role: users.role,
        status: users.status, createdAt: users.createdAt, lastLoginAt: users.lastLoginAt,
    }).from(users).orderBy(users.createdAt);

    return NextResponse.json({ users: allUsers });
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || !["super_admin","admin"].includes(session.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
        const message = parsed.error.issues[0]?.message ?? "Invalid input";
        return NextResponse.json({ error: message }, { status: 400 });
    }

    const { name, email, password, role } = parsed.data;

    const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    if (existing.length > 0) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

    const passwordHash = await hashPassword(password);
    const [user] = await db.insert(users).values({ name, email: email.toLowerCase(), passwordHash, role, status: "active" })
        .returning({ id: users.id, name: users.name, email: users.email, role: users.role });

    return NextResponse.json({ success: true, user });
}