"use server";

import { db, users } from "@/db";
import { verifyPassword, signToken, setSessionCookie } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
    const email    = String(formData.get("email")    ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
        return { error: "Email and password are required." };
    }

    try {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (!user)                    return { error: "Invalid email or password." };
        if (user.status !== "active") return { error: "Account suspended. Contact super admin." };

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return { error: "Invalid email or password." };

        // Update last login
        await db.update(users)
            .set({ lastLoginAt: new Date(), updatedAt: new Date() })
            .where(eq(users.id, user.id));

        // Build token — include extra permissions from DB
        const token = signToken({
            userId: user.id,
            email:  user.email,
            role:   user.role,
            name:   user.name,
            permissions: (user.permissions as string[]) ?? [],
        });

        // Set cookie server-side — guaranteed to be available on next request
        await setSessionCookie(token);

    } catch (err) {
        console.error("[loginAction] error:", err);
        return { error: "Something went wrong. Check your DB connection." };
    }

    // Must be outside try/catch — Next.js throws redirect internally
    redirect("/admin/dashboard");
}