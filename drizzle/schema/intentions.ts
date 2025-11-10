import { InferSelectModel } from "drizzle-orm"
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const intentionsStatusEnum = pgEnum("intentions_status", [
  "pending",
  "approved",
  "rejected",
])

export const intentions = pgTable("intentions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  motivation: text("motivation").notNull(),
  status: intentionsStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export type Intention = InferSelectModel<typeof intentions>

export const INTENTIONS_STATUS = {
  pending: { label: "Pendente", value: "pending" },
  approved: { label: "Aprovado", value: "approved" },
  rejected: { label: "Rejeitado", value: "rejected" },
} as const
