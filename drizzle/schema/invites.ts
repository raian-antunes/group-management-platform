import { relations, InferSelectModel } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { intentions } from "./intentions"

export const invites = pgTable("invites", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),
  intentionId: text("intention_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  usedAt: timestamp("used_at"),
})

export const invitesRelations = relations(invites, ({ one }) => ({
  intention: one(intentions, {
    fields: [invites.intentionId],
    references: [intentions.id],
  }),
}))

export type Invite = InferSelectModel<typeof invites>
