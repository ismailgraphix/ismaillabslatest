import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/db";
import { verifyPassword, signToken, setSessionCookie } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = loginSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
        }

        const { email, password } = parsed.data;

        const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);

        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        if (user.status !== "active") {
            return NextResponse.json({ error: "Your account has been suspended. Contact the super admin." }, { status: 403 });
        }

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // Update last login
        await db.update(users).set({ lastLoginAt: new Date(), updatedAt: new Date() }).where(eq(users.id, user.id));

        const token = signToken({ userId: user.id, email: user.email, role: user.role, name: user.name });
        const cookie = setSessionCookie(token);

        const response = NextResponse.json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });

        response.cookies.set(cookie);
        return response;

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}