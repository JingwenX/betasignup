// Applies lib/db/migrations/*.sql in filename order.
//
// Every migration is written to be idempotent, so re-running is safe and there
// is no bookkeeping table to keep in sync.
//
//   pnpm db:migrate
//
// Reads .env.local via node --env-file (see package.json).

import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"
import pg from "pg"

const MIGRATIONS_DIR = join(import.meta.dirname, "..", "lib", "db", "migrations")

// DDL goes over the direct connection: the transaction pooler multiplexes
// sessions, which makes schema changes unreliable.
const connectionString =
  process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL ?? process.env.POSTGRES_URL

if (!connectionString) {
  console.error(
    "No connection string. Run `vercel env pull .env.local`, or set DATABASE_URL yourself.",
  )
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
  const files = (await readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith(".sql")).sort()

  for (const file of files) {
    process.stdout.write(`  ${file} ... `)
    await client.query(await readFile(join(MIGRATIONS_DIR, file), "utf8"))
    console.log("ok")
  }

  console.log(`\nApplied ${files.length} migration${files.length === 1 ? "" : "s"}.`)
} finally {
  await client.end()
}
