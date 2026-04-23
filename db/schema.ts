import { pgTable, uuid, varchar, text, boolean, timestamp, pgEnum, integer, jsonb } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["super_admin", "admin", "editor", "viewer"]);
export const statusEnum = pgEnum("status", ["active", "inactive", "suspended"]);
export const clientStatusEnum = pgEnum("client_status", ["lead", "active", "completed", "archived"]);
export const messageStatusEnum = pgEnum("message_status", ["unread", "read", "replied", "archived"]);

// ── Users ──
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").notNull().default("viewer"),
    status: statusEnum("status").notNull().default("active"),
    avatar: text("avatar"),
    permissions: jsonb("permissions").$type<string[]>().default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    lastLoginAt: timestamp("last_login_at"),
});

// ── Portfolio items (projects shown on frontend) ──
export const portfolioItems = pgTable("portfolio_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    description: text("description"),
    image: text("image"),
    tags: jsonb("tags").$type<string[]>().default([]),
    liveUrl: text("live_url"),
    featured: boolean("featured").default(false),
    order: integer("order").default(0),
    published: boolean("published").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Team members (shown on frontend) ──
export const teamMembers = pgTable("team_members", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    role: varchar("role", { length: 255 }).notNull(),
    bio: text("bio"),
    image: text("image"),
    email: varchar("email", { length: 255 }),
    linkedin: text("linkedin"),
    twitter: text("twitter"),
    order: integer("order").default(0),
    published: boolean("published").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    content: text("content"),
    icon: text("icon"),
    image: text("image"),
    order: integer("order").default(0),
    published: boolean("published").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Contact messages ──
export const messages = pgTable("messages", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    subject: varchar("subject", { length: 500 }),
    message: text("message").notNull(),
    status: messageStatusEnum("status").default("unread").notNull(),
    ipAddress: varchar("ip_address", { length: 50 }),
    repliedAt: timestamp("replied_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Clients ──
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

// ── Audit logs ──
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
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Client = typeof clients.$inferSelect;

// ── Blog Categories ──
export const blogCategories = pgTable("blog_categories", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Blog Posts ──
export const blogPosts = pgTable("blog_posts", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    image: text("image"),
    categoryId: uuid("category_id").references(() => blogCategories.id),
    authorId: uuid("author_id").references(() => users.id),
    published: boolean("published").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type BlogCategory = typeof blogCategories.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
// ── Project type enum ──
export const projectTypeEnum = pgEnum("project_type", ["web", "landing", "mobile_app"]);

// ── Projects (agency work — separate from personal portfolio) ──
export const projects = pgTable("projects", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    image: text("image"),
    techStack: jsonb("tech_stack").$type<string[]>().default([]),
    type: projectTypeEnum("type").notNull().default("web"),
    link: text("link"),
    published: boolean("published").default(false),
    order: integer("order").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export const pageViews = pgTable("page_views", {
    id: uuid("id").defaultRandom().primaryKey(),
    path: varchar("path", { length: 500 }).notNull(),
    referrer: text("referrer"),
    userAgent: text("user_agent"),
    ip: varchar("ip", { length: 100 }),
    country: varchar("country", { length: 100 }), // ← new
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PageView = typeof pageViews.$inferSelect;

// ── Personal Portfolio Configuration (JSON based) ──
export const personalPortfolio = pgTable("personal_portfolio", {
    id: uuid("id").defaultRandom().primaryKey(),
    hero: jsonb("hero").$type<{
        title: string;
        shortTitle: string;
        description: string;
        tags: string[];
        image: string;
        resumeUrl: string;
        yearsExp: number;
        projectsCount: number;
    }>().notNull(),
    skills: jsonb("skills").$type<{ name: string; level: number }[]>().notNull().default([]),
    otherSkills: jsonb("other_skills").$type<string[]>().notNull().default([]),
    experiences: jsonb("experiences").$type<{
        role: string;
        company: string;
        period: string;
        desc: string;
        tags: string[];
    }[]>().notNull().default([]),
    education: jsonb("education").$type<{
        degree: string;
        school: string;
        period: string;
        grade: string;
    }[]>().notNull().default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type PersonalPortfolio = typeof personalPortfolio.$inferSelect;
export type NewPersonalPortfolio = typeof personalPortfolio.$inferInsert;