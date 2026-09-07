import type { Metadata } from "next"
import Link from "next/link"
import { Starfield } from "@/components/starfield"
import { BetaSignupForm } from "@/components/beta-signup-form"

export const metadata: Metadata = {
  title: "AIdressMeWell — your AI stylist",
  description:
    "Try clothes on virtually and get outfit recommendations that actually match. Join the AIdressMeWell beta.",
}

const features = [
  {
    title: "Virtual try-on",
    body: "Upload a photo and see how a piece looks on you before you buy, with realistic fit, drape, and color.",
  },
  {
    title: "Outfits that match",
    body: "Our stylist reads color, occasion, and your existing wardrobe to suggest combinations that genuinely work together.",
  },
  {
    title: "Learns your taste",
    body: "The more you swipe and save, the sharper recommendations get, tuned to your style, budget, and the weather.",
  },
]

export default function AiDressMeWellPage() {
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
          AIdressMeWell
        </span>

        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Change your clothes. Find your look.
        </h1>
        <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          AIdressMeWell is a personal AI stylist. Swap outfits on a photo of yourself and get
          recommendations that match your body, your wardrobe, and the occasion. We&apos;re opening
          a limited beta.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm">
          <h2 className="text-sm font-medium text-foreground">Get early access</h2>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            Enter your email and we&apos;ll invite you as new beta seats open up.
          </p>
          <BetaSignupForm project="AIdressmewell" />
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
