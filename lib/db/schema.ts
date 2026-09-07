import { pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core"

export const betaSignups = pgTable(
  "beta_signups",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    project: text("project").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailProjectUnique: unique().on(t.email, t.project),
  }),
)
