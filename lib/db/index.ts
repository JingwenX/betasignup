import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

/**
 * Supabase connection string. Prefer the pooled ("Transaction pooler") URL: on
 * serverless every function instance opens its own pool, and Postgres' direct
 * connection limit is far below the number of instances Vercel will spin up.
 */
export function databaseUrl(): string | undefined {
  return process.env.DATABASE_URL || undefined
}

/**
 * Callers check this before querying: without a connection string the driver
 * fails with something opaque rather than anything an operator can act on.
 */
export function isDatabaseConfigured(): boolean {
  return databaseUrl() !== undefined
}

function createPool() {
  const connectionString = databaseUrl()
  const isLocal = !connectionString || /@(localhost|127\.0\.0\.1)[:/]/.test(connectionString)

  return new Pool({
    connectionString,
    // Supabase terminates TLS with a certificate Node's default trust store
    // doesn't recognise, so verification is off: the connection is encrypted
    // but unauthenticated. Pin their CA here if this ever carries anything
    // more sensitive than an email address.
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
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
