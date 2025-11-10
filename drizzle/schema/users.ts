import { InferSelectModel, relations } from "drizzle-orm"
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { announcements } from "./announcements"
import { meetingsToUsers } from "./meetingsToUsers"
import { invites } from "./invites"

export const userRoleEnum = pgEnum("user_role", ["admin", "user"])

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  company: text("company").notNull(),
  inviteId: text("invite_id"),
})

export const usersRelations = relations(users, ({ many, one }) => ({
  announcements: many(announcements),
  meetingsToUsers: many(meetingsToUsers),
  invites: one(invites, {
    fields: [users.inviteId],
    references: [invites.id],
  }),
}))

export type User = InferSelectModel<typeof users>

export const USER_ROLE = {
  user: { label: "Usuário", value: "user" },
  admin: { label: "Administrador", value: "admin" },
} as const
