import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { InferSelectModel, relations } from "drizzle-orm"
import { meetings } from "./meetings"
import { users } from "./users"

export const meetingsToUsers = pgTable("meetings_to_users", {
  meetingId: text("meeting_id").notNull(),
  userId: text("user_id").notNull(),
  checkin: timestamp("checkin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const meetingsRelations = relations(meetings, ({ many }) => ({
  meetingsToUsers: many(meetingsToUsers),
}))

export const meetingsToUsersRelations = relations(
  meetingsToUsers,
  ({ one }) => ({
    meeting: one(meetings, {
      fields: [meetingsToUsers.meetingId],
      references: [meetings.id],
    }),
    user: one(users, {
      fields: [meetingsToUsers.userId],
      references: [users.id],
    }),
  })
)

export type MeetingToUser = InferSelectModel<typeof meetingsToUsers>
