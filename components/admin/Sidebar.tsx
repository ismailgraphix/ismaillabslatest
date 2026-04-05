"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "grid", perm: "dashboard.view" },
    { href: "/admin/messages",  label: "Messages",   icon: "mail",  perm: "clients.view", badge: true },
    { href: "/admin/clients",   label: "Clients",    icon: "users", perm: "clients.view" },
    { href: "/admin/portfolio", label: "Portfolio",  icon: "image", perm: "projects.view" },
    { href: "/admin/team",      label: "Team",       icon: "people",perm: "team.view" },
    { href: "/admin/services",  label: "Services",   icon: "star",  perm: "projects.view" },
    { href: "/admin/blog",      label: "Blog",       icon: "edit",  perm: "blog.view" },
    { href: "/admin/users",     label: "Users",      icon: "shield",perm: "users.view" },
    { href: "/admin/settings",  label: "Settings",   icon: "cog",   perm: "settings.view" },
];

const icons: Record<string, JSX.Element> = {
    grid:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>,
    mail:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    users:  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M1 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M11 3c1.1 0 2 .9 2 2s-.9 2-2 2M15 14c0-2.2-1.3-4-3-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    image:  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="5.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1 11l4-3 3 2.5 2-1.5 5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    people: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="11" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M0.5 14c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M11 9.5c2.5 0 4.5 2 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    star:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.8 4H14l-3.5 2.6 1.4 4.4L8 9.4 4.1 12 5.5 7.6 2 5h4.2L8 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
    edit:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 12.5L10.5 4l2 2L4 14.5H2v-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 5l2 2" stroke="currentColor" strokeWidth="1.5"/></svg>,
    shield: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l6 2.5v5C14 11.5 11 14.5 8 15c-3-0.5-6-3.5-6-6.5v-5L8 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    cog:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M3.1 12.9l1.4-1.4M11.5 4.5l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
};

interface SidebarProps {
    userName: string;
    userRole: string;
    userEmail: string;
    unreadCount?: number;
}

export default function Sidebar({ userName, userRole, userEmail, unreadCount = 0 }: SidebarProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    async function handleLogout() {
        await fetch("/api/admin/logout", { method: "POST" });
        window.location.href = "/admin/login";
    }

    return (
        <aside className={`h-screen sticky top-0 flex flex-col bg-[#0d0d0d] border-r border-white/[0.06] transition-all duration-300 ${collapsed ? "w-16" : "w-60"} flex-shrink-0`}>

            {/* Logo */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-white/[0.06]">
                {!collapsed && (
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#4353FF] flex items-center justify-center flex-shrink-0">
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                <path d="M4 3h7.5C13.985 3 16 5.015 16 7.5S13.985 12 11.5 12H4V3z" fill="white"/>
                                <path d="M4 12l5 5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div className="leading-none">
                            <p className="font-heading font-black text-white text-[13px] tracking-tight">ismaillabs</p>
                            <p className="font-body text-[9px] text-gray-500 uppercase tracking-[0.18em]">admin</p>
                        </div>
                    </div>
                )}
                <button onClick={() => setCollapsed(!collapsed)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 rounded transition-colors">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d={collapsed ? "M5 3l4 4-4 4" : "M9 3L5 7l4 4"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
                <div className="space-y-0.5 px-2">
                    {nav.map(item => {
                        const active = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link key={item.href} href={item.href}
                                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-150 group relative ${
                                      active
                                          ? "bg-[#4353FF] text-white"
                                          : "text-gray-400 hover:text-white hover:bg-white/5"
                                  }`}>
                                <span className="flex-shrink-0">{icons[item.icon]}</span>
                                {!collapsed && (
                                    <>
                                        <span className="font-body font-medium text-[13px] flex-1 whitespace-nowrap">{item.label}</span>
                                        {item.badge && unreadCount > 0 && (
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-white text-[#4353FF]" : "bg-[#4353FF] text-white"}`}>
                        {unreadCount}
                      </span>
                                        )}
                                    </>
                                )}
                                {/* Tooltip for collapsed */}
                                {collapsed && (
                                    <div className="absolute left-14 bg-[#1a1a1a] border border-white/10 text-white text-xs px-2.5 py-1.5 whitespace-nowrap rounded-sm opacity-0 pointer-events-none group-hover:opacity-100 z-50 transition-opacity">
                                        {item.label}
                                        {item.badge && unreadCount > 0 && <span className="ml-1.5 bg-[#4353FF] text-white text-[9px] px-1.5 rounded-full">{unreadCount}</span>}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* User */}
            <div className="border-t border-white/[0.06] p-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#4353FF]/20 border border-[#4353FF]/30 flex items-center justify-center flex-shrink-0">
                        <span className="font-heading font-black text-[#4353FF] text-xs">{userName[0]?.toUpperCase()}</span>
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="font-heading font-bold text-white text-xs truncate">{userName}</p>
                            <p className="font-body text-[10px] text-[#4353FF] capitalize">{userRole.replace("_", " ")}</p>
                        </div>
                    )}
                    {!collapsed && (
                        <button onClick={handleLogout}
                                className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0" title="Sign out">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M5 1H2a1 1 0 00-1 1v10a1 1 0 001 1h3M9 10l3-3-3-3M12 7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}