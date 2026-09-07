"use server"

import { db } from "@/lib/db"
import { betaSignups } from "@/lib/db/schema"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type SignupState = {
  status: "idle" | "success" | "error"
  message: string
}

export async function joinBeta(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()
  const project = String(formData.get("project") ?? "").trim()

  if (!project) {
    return { status: "error", message: "Missing project." }
  }
  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Please enter a valid email address." }
  }

  try {
    await db.insert(betaSignups).values({ email, project }).onConflictDoNothing()
    return { status: "success", message: "You're on the list. We'll be in touch soon." }
  } catch (err) {
    console.log("[v0] joinBeta error:", err instanceof Error ? err.message : err)
    return { status: "error", message: "Something went wrong. Please try again." }
  }
}
