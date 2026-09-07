// Applies lib/db/schema.sql. See that file - it drops the table first.
//
//   pnpm db:setup
//
// Reads .env.local via node --env-file-if-exists (see package.json).

import { readFile } from "node:fs/promises"
import { join } from "node:path"
import pg from "pg"

// DDL goes over the direct connection: the transaction pooler multiplexes
// sessions, which makes schema changes unreliable.
const connectionString =
  process.env.DATABASE_URL ??
  process.env.betasignup_POSTGRES_URL_NON_POOLING ??
  process.env.betasignup_POSTGRES_URL

if (!connectionString) {
  console.error("No connection string. Run `vercel env pull .env.local`.")
  process.exit(1)
}

// Supabase's chain is self-signed, and the `sslmode=require` in its URL would
// otherwise override the ssl option below and demand a verifiable chain.
const url = new URL(connectionString)
url.searchParams.delete("sslmode")

const client = new pg.Client({
  connectionString: url.toString(),
  ssl: { rejectUnauthorized: false },
})

await client.connect()

try {
  const sql = await readFile(join(import.meta.dirname, "..", "lib", "db", "schema.sql"), "utf8")
  await client.query(sql)
  console.log("beta_signups created.")
} finally {
  await client.end()
}
