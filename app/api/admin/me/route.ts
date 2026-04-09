import { NextResponse } from "next/server";
import { getSession, hashPassword } from "@/lib/auth";
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

export async function PATCH(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { name, email, password, avatar } = body;
        
        const updateData: Partial<typeof users.$inferInsert> = {};
        
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (avatar !== undefined) updateData.avatar = avatar; // Allow null to clear
        
        if (password && password.trim() !== "") {
            updateData.passwordHash = await hashPassword(password);
        }

        updateData.updatedAt = new Date();

        await db.update(users).set(updateData).where(eq(users.id, session.userId));
        
        return NextResponse.json({ success: true, message: "Profile updated successfully" });
    } catch (err: any) {
        return NextResponse.json({ error: "Update failed", details: err.message }, { status: 500 });
    }
}