import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/db";
import { hashPassword } from "@/lib/auth";
import { eq, count } from "drizzle-orm";
import { z } from "zod";

const setupSchema = z.object({
    setupToken: z.string(),
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[0-9]/, "Must contain a number")
        .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
});

export async function GET() {
    try {
        // Check if any super admin exists
        const result = await db.select({ count: count() }).from(users).where(eq(users.role, "super_admin"));
        const superAdminCount = result[0]?.count ?? 0;
        return NextResponse.json({ hasSuperAdmin: superAdminCount > 0 });
    } catch (error) {
        return NextResponse.json({ hasSuperAdmin: false });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = setupSchema.safeParse(body);

        if (!parsed.success) {
            const message = parsed.error.issues[0]?.message ?? "Invalid input";
            return NextResponse.json({ error: message }, { status: 400 });
        }

        const { setupToken, name, email, password } = parsed.data;

        // Verify setup token
        if (setupToken !== process.env.SETUP_TOKEN) {
            return NextResponse.json(
                { error: "Invalid setup token. Check your .env.local file." },
                { status: 403 }
            );
        }

        // Ensure no super admin exists yet
        const existing = await db.select({ count: count() }).from(users).where(eq(users.role, "super_admin"));
        if ((existing[0]?.count ?? 0) > 0) {
            return NextResponse.json(
                { error: "A super admin already exists. Use the login page instead." },
                { status: 409 }
            );
        }

        // Check email not taken
        const emailCheck = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
        if (emailCheck.length > 0) {
            return NextResponse.json({ error: "Email already in use" }, { status: 409 });
        }

        // Create super admin
        const passwordHash = await hashPassword(password);
        const [newUser] = await db.insert(users).values({
            name,
            email: email.toLowerCase(),
            passwordHash,
            role: "super_admin",
            status: "active",
        }).returning({ id: users.id, name: users.name, email: users.email, role: users.role });

        return NextResponse.json({
            success: true,
            message: "Super admin created successfully. You can now log in.",
            user: newUser,
        });

    } catch (error) {
        console.error("Setup error:", error);
        return NextResponse.json({ error: "Something went wrong. Check your database connection." }, { status: 500 });
    }
}