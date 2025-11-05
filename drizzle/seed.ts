import "dotenv/config"
import { hash } from "bcrypt"
import { db } from "./config"
import { v4 as uuidv4 } from "uuid"
import { announcements, intentions, invites, users } from "./schema"

async function seed() {
  console.log("Starting database seeding...")

  // Clean up existing data
  await db.delete(announcements)
  await db.delete(invites)
  await db.delete(intentions)
  await db.delete(users)

  // Create demo users
  const demoPassword = await hash("password123", 10)

  const adminUserId = uuidv4()
  const memberUserId = uuidv4()

  const adminUser = await db
    .insert(users)
    .values({
      id: adminUserId,
      email: "admin@example.com",
      password: demoPassword,
      role: "admin",
    })
    .returning()
    .then((rows) => rows[0])

  const memberUser = await db
    .insert(users)
    .values({
      id: memberUserId,
      email: "user@example.com",
      password: demoPassword,
      role: "user",
    })
    .returning()
    .then((rows) => rows[0])

  console.log("Created demo users:")
  console.log(`- Admin: ${adminUser.email} (password: password123)`)
  console.log(`- User: ${memberUser.email} (password: password123)`)

  console.log("Database seeding completed!")
  process.exit(0)
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    console.log("Seed script finished")
  })
