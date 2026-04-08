import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { hasPermission, PermissionName } from "@/lib/permissions";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "ismaillabs_admin_token";

export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    name: string;
    permissions?: string[]; // extra permissions beyond role defaults
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function signToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}

export async function getSession(): Promise<JWTPayload | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        if (!token) return null;
        return verifyToken(token);
    } catch {
        return null;
    }
}

export async function setSessionCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });
}

export async function clearSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

// --- API Route Helpers ---
export async function requirePermission(permission: PermissionName) {
    const user = await getSession();
    if (!user) return { forbidden: true, user: null };
    const canAccess = hasPermission(user.role, user.permissions, permission);
    return { forbidden: !canAccess, user };
}

export const getSessionUser = getSession;