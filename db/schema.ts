import { pgTable, uuid, varchar, text, boolean, timestamp, pgEnum, integer } from "drizzle-orm/pg-core";

// ─── Enums ───
export const roleEnum = pgEnum("role", ["super_admin", "admin", "editor", "viewer"]);
export const statusEnum = pgEnum("status", ["active", "inactive", "suspended"]);
export const clientStatusEnum = pgEnum("client_status", ["lead", "active", "completed", "archived"]);

// ─── Users / Admins table ───
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").notNull().default("viewer"),
    status: statusEnum("status").notNull().default("active"),
    avatar: text("avatar"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    lastLoginAt: timestamp("last_login_at"),
});

// ─── Permissions table ───
export const permissions = pgTable("permissions", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(), // e.g. "clients.create"
    label: varchar("label", { length: 200 }).notNull(),         // e.g. "Create Clients"
    module: varchar("module", { length: 100 }).notNull(),       // e.g. "clients"
    description: text("description"),
});

// ─── Role permissions (which roles get which permissions) ───
export const rolePermissions = pgTable("role_permissions", {
    id: uuid("id").defaultRandom().primaryKey(),
    role: roleEnum("role").notNull(),
    permissionId: uuid("permission_id").notNull().references(() => permissions.id, { onDelete: "cascade" }),
});

// ─── User permissions (overrides per user) ───
export const userPermissions = pgTable("user_permissions", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id").notNull().references(() => permissions.id, { onDelete: "cascade" }),
    granted: boolean("granted").notNull().default(true), // false = explicitly denied
});

// ─── Clients ───
export const clients = pgTable("clients", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    company: varchar("company", { length: 255 }),
    status: clientStatusEnum("status").notNull().default("lead"),
    notes: text("notes"),
    budget: integer("budget"),
    assignedTo: uuid("assigned_to").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Audit log ───
export const auditLogs = pgTable("audit_logs", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id),
    action: varchar("action", { length: 255 }).notNull(),
    module: varchar("module", { length: 100 }).notNull(),
    details: text("details"),
    ipAddress: varchar("ip_address", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Permission = typeof permissions.$inferSelect;
export type Client = typeof clients.$inferSelect;