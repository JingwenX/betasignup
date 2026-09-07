import Link from "next/link"
import { Starfield } from "@/components/starfield"

const projects = [
  {
    slug: "housedesign",
    name: "HouseDesign",
    tagline: "Design your home in 3D",
  },
  {
    slug: "AIdressmewell",
    name: "AIdressMeWell",
    tagline: "AI stylist that dresses you well",
  },
]

export default function HomePage() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-16">
      <Starfield />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <span className="mb-6 rounded-full border border-border bg-card/40 px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
          Beta access
        </span>

        <h1 className="text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">Nebula</h1>
        <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
          A launchpad for our in-progress AI experiments. Pick one, join its beta, and help us
          shape what comes next.
        </p>

        <nav className="mt-10 flex w-full flex-col gap-3" aria-label="Beta experiments">
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card/40 px-5 py-4 text-left backdrop-blur-sm transition-colors hover:border-primary hover:bg-card/70"
            >
              <span>
                <span className="block font-medium text-foreground">{p.name}</span>
                <span className="block text-sm text-muted-foreground">{p.tagline}</span>
              </span>
              <span
                aria-hidden="true"
                className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
              >
                &rarr;
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  )
}
