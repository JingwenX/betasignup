import { sql } from "drizzle-orm"
import { check, index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core"

/**
 * Mirrors lib/db/schema.sql. The SQL file is the
 * source of truth (it also carries the RLS setup, which Drizzle can't express);
 * this definition exists so queries are typed.
 */
export const betaSignups = pgTable(
  "beta_signups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    project: text("project").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // One signup per experiment, but the same person may join several. Emails
    // are stored lowercased, so this is case-insensitive in practice.
    uniqueIndex("beta_signups_email_project_key").on(t.email, t.project),
    index("beta_signups_created_at_idx").on(t.createdAt.desc()),
    check("beta_signups_email_lowercase", sql`${t.email} = lower(${t.email})`),
    check(
      "beta_signups_email_shape",
      sql`${t.email} ~ '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$'`,
    ),
    check("beta_signups_email_len", sql`length(${t.email}) <= 254`),
    check("beta_signups_project_len", sql`length(${t.project}) between 1 and 64`),
  ],
)

export type BetaSignup = typeof betaSignups.$inferSelect
