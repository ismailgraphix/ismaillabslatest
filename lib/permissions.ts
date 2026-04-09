// ── All permissions in the system ──────────────────────────────────────────
export const ALL_PERMISSIONS = [
    // Dashboard
    { name: "dashboard.view", label: "View Dashboard", module: "dashboard" },

    // Messages
    { name: "messages.view", label: "View Messages", module: "messages" },
    { name: "messages.reply", label: "Reply to Messages", module: "messages" },
    { name: "messages.delete", label: "Delete Messages", module: "messages" },

    // Clients
    { name: "clients.view", label: "View Clients", module: "clients" },
    { name: "clients.create", label: "Create Clients", module: "clients" },
    { name: "clients.edit", label: "Edit Clients", module: "clients" },
    { name: "clients.delete", label: "Delete Clients", module: "clients" },

    // Portfolio
    { name: "portfolio.view", label: "View Portfolio", module: "portfolio" },
    { name: "portfolio.create", label: "Add Portfolio Items", module: "portfolio" },
    { name: "portfolio.edit", label: "Edit Portfolio Items", module: "portfolio" },
    { name: "portfolio.delete", label: "Delete Portfolio", module: "portfolio" },
    { name: "portfolio.publish", label: "Publish / Unpublish", module: "portfolio" },

    // Team
    { name: "team.view", label: "View Team", module: "team" },
    { name: "team.create", label: "Add Team Members", module: "team" },
    { name: "team.edit", label: "Edit Team Members", module: "team" },
    { name: "team.delete", label: "Remove Team Members", module: "team" },

    // Services
    { name: "services.view", label: "View Services", module: "services" },
    { name: "services.create", label: "Create Services", module: "services" },
    { name: "services.edit", label: "Edit Services", module: "services" },
    { name: "services.delete", label: "Delete Services", module: "services" },

    // Blog
    { name: "blog.view", label: "View Blog Posts", module: "blog" },
    { name: "blog.create", label: "Create Blog Posts", module: "blog" },
    { name: "blog.edit", label: "Edit Blog Posts", module: "blog" },
    { name: "blog.delete", label: "Delete Blog Posts", module: "blog" },
    { name: "blog.publish", label: "Publish Blog Posts", module: "blog" },


    // Projects
    { name: "projects.view", label: "View Projects", module: "projects" },
    { name: "projects.create", label: "Create Projects", module: "projects" },
    { name: "projects.edit", label: "Edit Projects", module: "projects" },
    { name: "projects.delete", label: "Delete Projects", module: "projects" },
    { name: "projects.publish", label: "Publish Projects", module: "projects" },


    // Users — super_admin only
    { name: "users.view", label: "View Admin Users", module: "users" },
    { name: "users.create", label: "Create Admin Users", module: "users" },
    { name: "users.edit", label: "Edit Admin Users", module: "users" },
    { name: "users.delete", label: "Delete Admin Users", module: "users" },

    // Settings — super_admin only
    { name: "settings.view", label: "View Settings", module: "settings" },
    { name: "settings.edit", label: "Edit Settings", module: "settings" },
] as const;

export type PermissionName = typeof ALL_PERMISSIONS[number]["name"];

// ── Default permissions per role ───────────────────────────────────────────
// super_admin: skips this list — hasPermission() returns true unconditionally
export const ROLE_DEFAULT_PERMISSIONS: Record<string, PermissionName[]> = {
    super_admin: ALL_PERMISSIONS.map(p => p.name),

    admin: [],
    editor: [],
    viewer: [],
};

// ── Core permission check ──────────────────────────────────────────────────
export function hasPermission(
    role: string,
    userExtraPerms: string[] | null | undefined,
    permission: PermissionName
): boolean {
    if (role === "super_admin") return true;
    const defaults = ROLE_DEFAULT_PERMISSIONS[role] ?? [];
    if ((defaults as string[]).includes(permission)) return true;
    if (userExtraPerms?.includes(permission)) return true;
    return false;
}

// ── Effective permissions (no Set spread — avoids TS2802) ─────────────────
export function getEffectivePermissions(
    role: string,
    userExtraPerms: string[] | null | undefined
): PermissionName[] {
    if (role === "super_admin") return ALL_PERMISSIONS.map(p => p.name);

    const defaults = (ROLE_DEFAULT_PERMISSIONS[role] ?? []) as PermissionName[];
    const extra = (userExtraPerms ?? []) as PermissionName[];

    // Deduplicate without Set spread
    const seen: Record<string, boolean> = {};
    const result: PermissionName[] = [];
    for (const p of defaults.concat(extra)) {
        if (!seen[p]) { seen[p] = true; result.push(p); }
    }
    return result;
}

// ── Group permissions by module (for the permissions UI) ──────────────────
export function getPermissionsByModule(): Map<string, typeof ALL_PERMISSIONS[number][]> {
    const map = new Map<string, typeof ALL_PERMISSIONS[number][]>();
    for (const perm of ALL_PERMISSIONS) {
        if (!map.has(perm.module)) map.set(perm.module, []);
        map.get(perm.module)!.push(perm);
    }
    return map;
}

// ── Nav Permissions Mapping ───────────────────────────────────────────────
export const NAV_PERMISSIONS: Record<string, PermissionName> = {
    "/admin/dashboard": "dashboard.view",
    "/admin/messages": "messages.view",
    "/admin/clients": "clients.view",
    "/admin/portfolio": "portfolio.view",
    "/admin/team": "team.view",
    "/admin/services": "services.view",
    "/admin/blog": "blog.view",
    "/admin/users": "users.view",
    "/admin/settings": "settings.view",
    "/admin/projects": "projects.view",
};