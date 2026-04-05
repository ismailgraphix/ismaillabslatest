import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, users } from "@/db";
import { eq } from "drizzle-orm";

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [user] = await db.select({
        id: users.id, name: users.name, email: users.email,
        role: users.role, status: users.status, avatar: users.avatar,
        createdAt: users.createdAt, lastLoginAt: users.lastLoginAt,
    }).from(users).where(eq(users.id, session.userId)).limit(1);

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
}