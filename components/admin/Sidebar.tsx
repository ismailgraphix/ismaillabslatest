"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_PERMISSIONS } from "@/lib/permissions";

const ALL_NAV = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "grid" },
    { href: "/admin/messages", label: "Messages", icon: "mail", badge: true },
    { href: "/admin/clients", label: "Clients", icon: "users" },
    { href: "/admin/projects", label: "Projects", icon: "layers" },
    { href: "/admin/portfolio", label: "Portfolio", icon: "image" },
    { href: "/admin/team", label: "Team", icon: "people" },
    { href: "/admin/services", label: "Services", icon: "star" },
    { href: "/admin/blog", label: "Blog", icon: "edit" },
    { href: "/admin/users", label: "Users", icon: "shield" },
    { href: "/admin/settings", label: "Settings", icon: "cog" },
];

const ICONS: Record<string, JSX.Element> = {
    grid: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" /></svg>,
    mail: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
    users: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M1 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M11 3c1.1 0 2 .9 2 2s-.9 2-2 2M15 14c0-2.2-1.3-4-3-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
    image: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" /><circle cx="5.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M1 11l4-3 3 2.5 2-1.5 5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    people: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" /><circle cx="11" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" /><path d="M0.5 14c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M11 9.5c2.5 0 4.5 2 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
    star: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.8 4H14l-3.5 2.6 1.4 4.4L8 9.4 4.1 12 5.5 7.6 2 5h4.2L8 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>,
    edit: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 12.5L10.5 4l2 2L4 14.5H2v-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M9 5l2 2" stroke="currentColor" strokeWidth="1.5" /></svg>,
    shield: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1l6 2.5v5C14 11.5 11 14.5 8 15c-3-.5-6-3.5-6-6.5v-5L8 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    layers: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L15 5l-7 4L1 5l7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M1 9l7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    cog: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" /><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M3.1 12.9l1.4-1.4M11.5 4.5l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
};

interface SidebarProps {
    userName: string;
    userRole: string;
    userEmail: string;
    userAvatar?: string | null;
    userPermissions?: string[];
    unreadCount?: number;
}

export default function Sidebar({
    userName, userRole, userEmail, userAvatar,
    userPermissions = [],
    unreadCount = 0,
}: SidebarProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const superAdmin = userRole === "super_admin";

    // Filter nav items based on permissions
    const visibleNav = ALL_NAV.filter(item => {
        if (item.href === "/admin/dashboard") return true; // always visible
        if (superAdmin) return true;
        const requiredPerm = NAV_PERMISSIONS[item.href];
        if (!requiredPerm) return false;
        return userPermissions.includes(requiredPerm);
    });

    async function handleLogout() {
        await fetch("/api/admin/logout", { method: "POST" });
        window.location.href = "/admin/login";
    }

    return (
        <aside className={`h-screen sticky top-0 flex flex-col bg-[#0d0d0d] border-r border-white/[0.06] transition-all duration-300 flex-shrink-0 ${collapsed ? "w-[56px]" : "w-[220px]"}`}>

            {/* Logo */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06] min-h-[60px]">
                {!collapsed && (
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-7 h-7 bg-[#4353FF] flex items-center justify-center flex-shrink-0">
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                                <path d="M4 3h7.5C13.985 3 16 5.015 16 7.5S13.985 12 11.5 12H4V3z" fill="white" />
                                <path d="M4 12l5 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="font-heading font-black text-white text-[13px] tracking-tight leading-none truncate">ismaillabs</p>
                            <p className="font-body text-[9px] text-gray-600 uppercase tracking-[0.15em] mt-0.5">admin</p>
                        </div>
                    </div>
                )}
                <button onClick={() => setCollapsed(!collapsed)}
                    className={`w-6 h-6 flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/5 rounded transition-colors flex-shrink-0 ${collapsed ? "mx-auto" : ""}`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d={collapsed ? "M4 2l4 4-4 4" : "M8 2L4 6l4 4"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
                <div className="space-y-0.5 px-2">
                    {visibleNav.map(item => {
                        const active = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link key={item.href} href={item.href}
                                className={`relative flex items-center gap-2.5 px-3 py-2.5 text-sm transition-all duration-150 group rounded-sm ${active ? "bg-[#4353FF] text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}>
                                <span className="flex-shrink-0">{ICONS[item.icon]}</span>
                                {!collapsed && (
                                    <>
                                        <span className="font-body font-medium text-[13px] flex-1 whitespace-nowrap truncate">{item.label}</span>
                                        {item.badge && unreadCount > 0 && (
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${active ? "bg-white text-[#4353FF]" : "bg-[#4353FF] text-white"
                                                }`}>{unreadCount > 99 ? "99+" : unreadCount}</span>
                                        )}
                                    </>
                                )}
                                {/* Collapsed tooltip */}
                                {collapsed && (
                                    <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#1a1a1a] border border-white/10 text-white text-xs px-2.5 py-1.5 whitespace-nowrap rounded-sm opacity-0 pointer-events-none group-hover:opacity-100 z-50 transition-opacity shadow-xl">
                                        {item.label}
                                        {item.badge && unreadCount > 0 && (
                                            <span className="ml-1.5 bg-[#4353FF] text-white text-[9px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                                        )}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Role badge */}
            {!collapsed && (
                <div className="px-4 py-2 border-t border-white/[0.04]">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-body font-bold uppercase tracking-wider ${superAdmin ? "text-yellow-400 bg-yellow-400/10" : "text-[#4353FF] bg-[#4353FF]/10"
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${superAdmin ? "bg-yellow-400" : "bg-[#4353FF]"}`} />
                        {userRole.replace("_", " ")}
                    </div>
                </div>
            )}

            {/* User */}
            <div className="border-t border-white/[0.06] p-3 group relative">
                <Link href="/admin/profile" className={`flex items-center gap-2.5 hover:bg-white/5 p-1 rounded-md transition-colors ${collapsed ? "justify-center" : ""}`}>
                    {userAvatar ? (
                        <img src={userAvatar} alt="Avatar" className={`rounded-full object-cover border border-[#4353FF]/30 flex-shrink-0 ${collapsed ? "w-8 h-8" : "w-7 h-7"}`} />
                    ) : (
                        <div className={`rounded-full bg-[#4353FF]/20 border border-[#4353FF]/30 flex items-center justify-center flex-shrink-0 font-heading font-black text-[#4353FF] ${collapsed ? "w-8 h-8 text-sm" : "w-7 h-7 text-xs"}`}>
                            {userName[0]?.toUpperCase() || "?"}
                        </div>
                    )}
                    {!collapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="font-heading font-bold text-white text-xs truncate leading-none group-hover:text-[#4353FF] transition-colors">{userName}</p>
                                <p className="font-body text-[10px] text-gray-600 truncate mt-0.5">{userEmail}</p>
                            </div>
                        </>
                    )}
                </Link>
                {!collapsed && (
                    <button onClick={handleLogout} title="Sign out"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-red-400 transition-colors flex-shrink-0 p-2">
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                            <path d="M5 1H2a1 1 0 00-1 1v10a1 1 0 001 1h3M9 10l3-3-3-3M12 7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
            </div>
        </aside>
    );
}