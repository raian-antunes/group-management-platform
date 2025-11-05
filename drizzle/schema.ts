import { InferSelectModel, relations } from "drizzle-orm"
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

// Enums
export const intentionsStatusEnum = pgEnum("intentions_status", [
  "pending",
  "approved",
  "rejected",
])

export const userRoleEnum = pgEnum("user_role", ["admin", "user"])

// Tables
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  company: text("company").notNull(),
})

export const intentions = pgTable("intentions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  motivation: text("motivation").notNull(),
  status: intentionsStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const invites = pgTable("invites", {
  token: text("token").notNull().unique(),
  intentionId: text("intention_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const announcements = pgTable("announcements", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Relations between tables
export const intentionsRelations = relations(intentions, ({ one }) => ({
  user: one(users, {
    fields: [intentions.userId],
    references: [users.id],
  }),
}))

export const invitesRelations = relations(invites, ({ one }) => ({
  intentions: one(intentions, {
    fields: [invites.intentionId],
    references: [intentions.id],
  }),
}))

export const announcementsRelations = relations(announcements, ({ one }) => ({
  user: one(users, {
    fields: [announcements.userId],
    references: [users.id],
  }),
}))

// Types
export type User = InferSelectModel<typeof users>
export type Issue = InferSelectModel<typeof intentions>
export type Invites = InferSelectModel<typeof invites>
export type Announcements = InferSelectModel<typeof announcements>

// Status and Role Mappings
export const INTENTIONS_STATUS = {
  pending: { label: "Pendente", value: "pending" },
  approved: { label: "Aprovado", value: "approved" },
  rejected: { label: "Rejeitado", value: "rejected" },
}

export const USER_ROLE = {
  user: { label: "Usuário", value: "user" },
  admin: { label: "Administrador", value: "admin" },
}
