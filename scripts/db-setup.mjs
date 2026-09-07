// Applies lib/db/schema.sql. See that file - it drops the table first.
//
//   pnpm db:setup
//
// Reads .env.local via node --env-file-if-exists (see package.json).

import { readFile } from "node:fs/promises"
import { join } from "node:path"
import pg from "pg"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error("No DATABASE_URL. Run `vercel env pull .env.local`, or set it yourself.")
  process.exit(1)
}

const client = new pg.Client({
  connectionString,
  ssl: /@(localhost|127\.0\.0\.1)[:/]/.test(connectionString)
    ? undefined
    : { rejectUnauthorized: false },
})

await client.connect()

try {
  const sql = await readFile(join(import.meta.dirname, "..", "lib", "db", "schema.sql"), "utf8")
  await client.query(sql)
  console.log("beta_signups created.")
} finally {
  await client.end()
}
