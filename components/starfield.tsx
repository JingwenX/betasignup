"use client"

import { useEffect, useRef } from "react"

type Star = {
  x: number
  y: number
  z: number
  r: number
  twinkle: number
  twinkleSpeed: number
  hue: number
}

/**
 * Animated purple starfield rendered on a canvas. Stars drift slowly and
 * gently twinkle, giving a calm "magic / AI" atmosphere behind the content.
 * Respects prefers-reduced-motion by rendering a static field.
 */
export function Starfield({ density = 1 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let stars: Star[] = []
    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.floor((width * height) / 6500 * density)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.8 + 0.2,
        r: Math.random() * 1.5 + 0.3,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        hue: 270 + Math.random() * 45, // violet -> magenta
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (const s of stars) {
        s.x -= s.z * 0.15
        s.y += s.z * 0.05
        if (!reduceMotion) s.twinkle += s.twinkleSpeed
        if (s.x < -2) s.x = width + 2
        if (s.y > height + 2) s.y = -2

        const alpha = reduceMotion ? 0.6 : 0.35 + Math.sin(s.twinkle) * 0.35
        const glow = s.r * (2.5 + s.z)
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glow)
        grad.addColorStop(0, `hsla(${s.hue}, 90%, 78%, ${Math.max(0, alpha)})`)
        grad.addColorStop(0.4, `hsla(${s.hue}, 85%, 65%, ${Math.max(0, alpha) * 0.5})`)
        grad.addColorStop(1, "hsla(280, 80%, 60%, 0)")
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(s.x, s.y, glow, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    build()
    draw()

    const onResize = () => build()
    window.addEventListener("resize", onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
    }
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
    />
  )
}
