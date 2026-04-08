import { NextRequest, NextResponse } from "next/server";
import { NAV_PERMISSIONS, hasPermission } from "@/lib/permissions";

const COOKIE_NAME = "ismaillabs_admin_token";

// Paths that never need auth
const PUBLIC_PATHS = [
    "/admin/login",
    "/admin/setup",
    "/api/admin/login",
    "/api/admin/logout",
    "/api/admin/setup",
    "/api/admin/check",
];

function decodeJWT(token: string): Record<string, unknown> | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;

        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
        const decoded = JSON.parse(atob(padded));

        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
            return null;
        }
        return decoded;
    } catch {
        return null;
    }
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Only protect /admin routes (not /api/admin public routes)
    const isAdminPage = pathname.startsWith("/admin");
    const isAdminApi  = pathname.startsWith("/api/admin");

    if (!isAdminPage && !isAdminApi) return NextResponse.next();

    // Always allow public paths through — no auth needed
    if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    // From here: protected admin pages + protected API routes
    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
        // API routes return 401, pages redirect to login
        if (isAdminApi) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    const payload = decodeJWT(token);

    if (!payload?.userId) {
        // Bad token — clear it
        if (isAdminApi) {
            const res = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            res.cookies.delete(COOKIE_NAME);
            return res;
        }
        const res = NextResponse.redirect(new URL("/admin/login", req.url));
        res.cookies.delete(COOKIE_NAME);
        return res;
    }

    // Check page-level permissions against NAV_PERMISSIONS
    if (isAdminPage && pathname !== "/admin/dashboard") {
        const role = String(payload.role);
        const perms = (payload.permissions as string[]) ?? [];
        
        for (const [route, perm] of Object.entries(NAV_PERMISSIONS)) {
            if (route !== "/admin/dashboard" && (pathname === route || pathname.startsWith(route + "/"))) {
                if (!hasPermission(role, perms, perm)) {
                    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
                }
                break;
            }
        }
    }

    // Valid — forward user info in headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id",    String(payload.userId));
    requestHeaders.set("x-user-role",  String(payload.role));
    requestHeaders.set("x-user-email", String(payload.email));
    requestHeaders.set("x-user-name",  String(payload.name));

    return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/api/admin/:path*",
    ],
};