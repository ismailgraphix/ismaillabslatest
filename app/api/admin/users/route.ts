import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/db";
import { getSessionUser, hashPassword, requirePermission } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const createSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["admin", "editor", "viewer"]),
    permissions: z.array(z.string()).optional().default([]),
});

export async function GET() {
    const { forbidden } = await requirePermission("users.view");
    if (forbidden) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const allUsers = await db.select({
        id: users.id, name: users.name, email: users.email,
        role: users.role, status: users.status,
        permissions: users.permissions,
        createdAt: users.createdAt, lastLoginAt: users.lastLoginAt,
    }).from(users).orderBy(users.createdAt);

    return NextResponse.json({ users: allUsers });
}

export async function POST(req: NextRequest) {
    const { forbidden, user: creator } = await requirePermission("users.create");
    if (forbidden || !creator) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const { name, email, password, role, permissions } = parsed.data;

    // Only super_admin can create admins
    if (role === "admin" && creator.role !== "super_admin") {
        return NextResponse.json({ error: "Only super admin can create admin users" }, { status: 403 });
    }

    const existing = await db.select({ id: users.id }).from(users)
        .where(eq(users.email, email.toLowerCase())).limit(1);
    if (existing.length > 0) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const [user] = await db.insert(users).values({
        name,
        email: email.toLowerCase(),
        passwordHash,
        role,
        status: "active",
        permissions: permissions || [],
    }).returning({ id: users.id, name: users.name, email: users.email, role: users.role });

    return NextResponse.json({ success: true, user });
}