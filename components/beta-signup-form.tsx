"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { joinBeta, type SignupState } from "@/app/actions/signup"
import type { ProjectSlug } from "@/lib/projects"
import { Button } from "@/components/ui/button"

const initialState: SignupState = { status: "idle", message: "" }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="h-11 shrink-0 px-6 font-medium">
      {pending ? "Joining..." : "Join beta"}
    </Button>
  )
}

export function BetaSignupForm({ project }: { project: ProjectSlug }) {
  const [state, formAction] = useActionState(joinBeta, initialState)

  return (
    <div className="w-full">
      <form action={formAction} className="flex flex-col gap-3 sm:flex-row">
        <input type="hidden" name="project" value={project} />
        <label htmlFor={`email-${project}`} className="sr-only">
          Email address
        </label>
        <input
          id={`email-${project}`}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="h-11 flex-1 rounded-md border border-input bg-background/60 px-4 text-foreground outline-none backdrop-blur-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
        <SubmitButton />
      </form>
      {state.status !== "idle" && (
        <p
          role="status"
          aria-live="polite"
          className={`mt-3 text-sm ${
            state.status === "success" ? "text-accent" : "text-destructive"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  )
}
