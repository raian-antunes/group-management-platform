import { Announcement, User } from "@/drizzle/schema"
import { apiClient } from "@/lib/apiClient"

export type AnnouncementWithUser = Announcement & {
  user: User
}

export const getAnnouncements = async (): Promise<{
  data: AnnouncementWithUser[]
}> => {
  return apiClient.get("/announcement")
}
