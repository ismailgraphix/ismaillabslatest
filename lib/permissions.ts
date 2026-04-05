// All permissions in the system
export const ALL_PERMISSIONS = [
    // Dashboard
    { name: "dashboard.view", label: "View Dashboard", module: "dashboard" },

    // Clients
    { name: "clients.view",   label: "View Clients",   module: "clients" },
    { name: "clients.create", label: "Create Clients", module: "clients" },
    { name: "clients.edit",   label: "Edit Clients",   module: "clients" },
    { name: "clients.delete", label: "Delete Clients", module: "clients" },

    // Projects / Services
    { name: "projects.view",   label: "View Projects",   module: "projects" },
    { name: "projects.create", label: "Create Projects", module: "projects" },
    { name: "projects.edit",   label: "Edit Projects",   module: "projects" },
    { name: "projects.delete", label: "Delete Projects", module: "projects" },

    // Blog
    { name: "blog.view",      label: "View Blog Posts",   module: "blog" },
    { name: "blog.create",    label: "Create Blog Posts", module: "blog" },
    { name: "blog.edit",      label: "Edit Blog Posts",   module: "blog" },
    { name: "blog.delete",    label: "Delete Blog Posts", module: "blog" },
    { name: "blog.publish",   label: "Publish Blog Posts",module: "blog" },

    // Team
    { name: "team.view",   label: "View Team Members",   module: "team" },
    { name: "team.create", label: "Add Team Members",    module: "team" },
    { name: "team.edit",   label: "Edit Team Members",   module: "team" },
    { name: "team.delete", label: "Remove Team Members", module: "team" },

    // Admin Users
    { name: "users.view",   label: "View Admin Users",   module: "users" },
    { name: "users.create", label: "Create Admin Users", module: "users" },
    { name: "users.edit",   label: "Edit Admin Users",   module: "users" },
    { name: "users.delete", label: "Delete Admin Users", module: "users" },

    // Settings
    { name: "settings.view", label: "View Settings", module: "settings" },
    { name: "settings.edit", label: "Edit Settings", module: "settings" },

    // Audit Logs
    { name: "audit.view", label: "View Audit Logs", module: "audit" },
] as const;

// Default permissions per role
export const ROLE_PERMISSIONS: Record<string, string[]> = {
    super_admin: ALL_PERMISSIONS.map(p => p.name), // gets everything
    admin: [
        "dashboard.view",
        "clients.view", "clients.create", "clients.edit",
        "projects.view", "projects.create", "projects.edit",
        "blog.view", "blog.create", "blog.edit", "blog.publish",
        "team.view", "team.create", "team.edit",
        "users.view",
        "settings.view",
        "audit.view",
    ],
    editor: [
        "dashboard.view",
        "clients.view",
        "projects.view", "projects.create", "projects.edit",
        "blog.view", "blog.create", "blog.edit",
        "team.view",
    ],
    viewer: [
        "dashboard.view",
        "clients.view",
        "projects.view",
        "blog.view",
        "team.view",
    ],
};

export type PermissionName = typeof ALL_PERMISSIONS[number]["name"];

export function hasPermission(userRole: string, userPerms: string[], permission: PermissionName): boolean {
    if (userRole === "super_admin") return true;
    return userPerms.includes(permission);
}

export function getModules() {
    const modules = new Map<string, typeof ALL_PERMISSIONS[number][]>();
    for (const perm of ALL_PERMISSIONS) {
        if (!modules.has(perm.module)) modules.set(perm.module, []);
        modules.get(perm.module)!.push(perm);
    }
    return modules;
}