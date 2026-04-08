import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/db";
import { verifyPassword, signToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const COOKIE_NAME = "ismaillabs_admin_token";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = loginSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const { email, password } = parsed.data;

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email.toLowerCase()))
            .limit(1);

        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }
        if (user.status !== "active") {
            return NextResponse.json({ error: "Account suspended. Contact super admin." }, { status: 403 });
        }

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        await db.update(users)
            .set({ lastLoginAt: new Date(), updatedAt: new Date() })
            .where(eq(users.id, user.id));

        const token = signToken({
            userId: user.id,
            email:  user.email,
            role:   user.role,
            name:   user.name,
            permissions: (user.permissions as string[]) ?? [],
        });

        const response = NextResponse.json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });

        // Set cookie directly on the JSON response
        // sameSite: "lax" works for both localhost and production
        response.cookies.set({
            name:     COOKIE_NAME,
            value:    token,
            httpOnly: true,
            secure:   process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge:   60 * 60 * 24 * 7, // 7 days
            path:     "/",
        });

        return response;
    } catch (err) {
        console.error("[login] error:", err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}