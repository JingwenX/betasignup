import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

/**
 * Supabase connection string.
 *
 * The Vercel integration provisions Postgres and exports its URLs under a
 * project-name prefix, so `betasignup_POSTGRES_URL` *is* the Supabase database
 * - despite the name, nothing here is left over from Neon. DATABASE_URL comes
 * first so a local .env can point somewhere else without touching Vercel.
 *
 * The pooled URL is the right default on serverless: every function instance
 * opens its own pool, and Postgres' direct connection limit is far below the
 * number of instances Vercel will spin up.
 */
export function databaseUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.betasignup_POSTGRES_URL || undefined
}

/**
 * Callers check this before querying: without a connection string the driver
 * fails with something opaque rather than anything an operator can act on.
 */
export function isDatabaseConfigured(): boolean {
  return databaseUrl() !== undefined
}

/**
 * Supabase presents a self-signed certificate chain, so verification has to be
 * off - the connection is encrypted but unauthenticated. Pin their CA here if
 * this ever carries anything more sensitive than an email address.
 *
 * The `sslmode=require` that Supabase puts in the URL takes precedence over the
 * `ssl` option in current pg and demands a verifiable chain, so strip it rather
 * than let it override the setting below.
 */
function connectionConfig(connectionString: string) {
  let url: URL
  try {
    url = new URL(connectionString)
  } catch {
    return { connectionString, ssl: { rejectUnauthorized: false } }
  }

  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1"
  url.searchParams.delete("sslmode")

  return {
    connectionString: url.toString(),
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
  }
}

function createPool() {
  const connectionString = databaseUrl()

  return new Pool({
    ...(connectionString ? connectionConfig(connectionString) : {}),
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  })
}

// Next.js re-evaluates modules on hot reload; without this every edit would
// leak a pool and exhaust the connection limit during a dev session.
const globalForDb = globalThis as unknown as { betaSignupPool?: Pool }

export const pool = globalForDb.betaSignupPool ?? createPool()

if (process.env.NODE_ENV !== "production") {
  globalForDb.betaSignupPool = pool
}

export const db = drizzle(pool, { schema })
