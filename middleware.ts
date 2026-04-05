import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/setup"];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Only run on /admin routes
    if (!pathname.startsWith("/admin")) return NextResponse.next();

    // Allow public admin pages
    if (PUBLIC_ADMIN_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next();

    // Check token
    const token = req.cookies.get("ismaillabs_admin_token")?.value;
    if (!token) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    const payload = await verifyToken(token);
    if (!payload) {
        const res = NextResponse.redirect(new URL("/admin/login", req.url));
        res.cookies.delete("ismaillabs_admin_token");
        return res;
    }

    // Inject user info into headers for server components
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-user-role", payload.role);
    requestHeaders.set("x-user-email", payload.email);
    requestHeaders.set("x-user-name", payload.name);

    return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
    matcher: ["/admin/:path*"],
};