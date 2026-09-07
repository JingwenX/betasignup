import type { Metadata } from "next"
import Link from "next/link"
import { Starfield } from "@/components/starfield"
import { BetaSignupForm } from "@/components/beta-signup-form"

export const metadata: Metadata = {
  title: "HouseDesign — design your home in 3D",
  description:
    "Sketch, furnish, and walk through your home in interactive 3D. Join the HouseDesign beta.",
}

const features = [
  {
    title: "Draw floor plans that come alive",
    body: "Drag walls, doors, and windows into place and watch them extrude into a true-to-scale 3D model in real time.",
  },
  {
    title: "Furnish from a living catalog",
    body: "Drop in furniture, fixtures, and finishes, then swap materials and colors to see the room change instantly.",
  },
  {
    title: "Walk through before you build",
    body: "Step inside in first-person, check sightlines and lighting at different times of day, and share a link for feedback.",
  },
]

export default function HouseDesignPage() {
  return (
    <main className="relative min-h-svh overflow-hidden px-6 py-14">
      <Starfield density={0.7} />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">&larr;</span> All experiments
        </Link>

        <span className="w-fit rounded-full border border-border bg-card/40 px-3 py-1 font-mono text-xs uppercase tracking-widest text-primary backdrop-blur-sm">
          HouseDesign
        </span>

        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Design your house in 3D, room by room.
        </h1>
        <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          HouseDesign turns a simple floor sketch into an explorable 3D home. Plan a remodel, test
          a layout, or dream up a new build without touching a single tool. We&apos;re opening a
          limited beta.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm">
          <h2 className="text-sm font-medium text-foreground">Get early access</h2>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            Enter your email and we&apos;ll invite you as new beta seats open up.
          </p>
          <BetaSignupForm project="housedesign" />
        </div>

        <div className="mt-12 flex flex-col gap-6">
          {features.map((f) => (
            <div key={f.title} className="border-l border-border pl-5">
              <h3 className="font-medium text-foreground">{f.title}</h3>
              <p className="mt-1 text-pretty leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
