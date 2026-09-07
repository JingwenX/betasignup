"use server"

import { db, isDatabaseConfigured } from "@/lib/db"
import { betaSignups } from "@/lib/db/schema"
import { isProjectSlug } from "@/lib/projects"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMAIL_MAX_LENGTH = 254

export type SignupState = {
  status: "idle" | "success" | "error"
  message: string
}

export async function joinBeta(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()
  const project = String(formData.get("project") ?? "").trim()

  // `project` comes from a hidden field, so it can be anything the client sends.
  if (!isProjectSlug(project)) {
    return { status: "error", message: "Unknown experiment." }
  }
  if (!EMAIL_RE.test(email) || email.length > EMAIL_MAX_LENGTH) {
    return { status: "error", message: "Please enter a valid email address." }
  }

  if (!isDatabaseConfigured()) {
    console.log("[signup] no Postgres connection string is set")
    return { status: "error", message: "Something went wrong. Please try again." }
  }

  try {
    // Signing up twice is a no-op rather than an error: telling the visitor
    // their address is already on the list would leak who has signed up.
    await db.insert(betaSignups).values({ email, project }).onConflictDoNothing()
    return { status: "success", message: "You're on the list. We'll be in touch soon." }
  } catch (err) {
    console.log("[signup] insert failed:", err instanceof Error ? err.message : err)
    return { status: "error", message: "Something went wrong. Please try again." }
  }
}
