import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { subscriptions } from "./subscriptions"
import { InferSelectModel, relations } from "drizzle-orm"

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
])

export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  subscriptionId: text("subscription_id").notNull(),
  amount: text("amount").notNull(),
  status: paymentStatusEnum("payment_status").notNull().default("pending"),
  dueDate: timestamp("due_date").notNull(),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const paymentsRelations = relations(payments, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [payments.subscriptionId],
    references: [subscriptions.id],
  }),
}))

export type Payment = InferSelectModel<typeof payments>
