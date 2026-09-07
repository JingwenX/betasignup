/**
 * Experiments that accept beta signups. `project` arrives from a hidden form
 * field, so it is attacker-controlled: every write path validates against this
 * list rather than trusting the POST body.
 *
 * Adding an experiment is a code change here plus a new page - deliberately not
 * a database constraint, so launching one doesn't need a migration.
 */
export const PROJECTS = ["housedesign", "AIdressmewell"] as const

export type ProjectSlug = (typeof PROJECTS)[number]

export function isProjectSlug(value: string): value is ProjectSlug {
  return (PROJECTS as readonly string[]).includes(value)
}
