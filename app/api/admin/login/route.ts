import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/db";
import { verifyPassword, signToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

const COOKIE_NAME = "ismaillabs_admin_token";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = loginSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
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
            return NextResponse.json(
                { error: "Your account has been suspended. Contact the super admin." },
                { status: 403 }
            );
        }

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        await db
            .update(users)
            .set({ lastLoginAt: new Date(), updatedAt: new Date() })
            .where(eq(users.id, user.id));

        const token = await signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        });

        // ✅ THE FIX: return a redirect response WITH the cookie set on it.
        // When the browser follows this redirect, the cookie is already committed
        // so the middleware sees it immediately on the /admin/dashboard request.
        const response = NextResponse.redirect(
            new URL("/admin/dashboard", req.url),
            { status: 303 } // 303 See Other — correct for POST → GET redirect
        );

        response.cookies.set({
            name: COOKIE_NAME,
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return response;

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}