import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import type { Legend } from '../../data/legends'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

type FunConfettiProps = {
  active: boolean
  legend: Legend | null
}

const CONFETTI_COLORS: Record<Legend['theme'], string[]> = {
  argentina: ['#47d6ff', '#dae2fc', '#e9c349'],
  portugal: ['#ff4444', '#22c55e', '#e9c349'],
  brazil: ['#e9c349', '#22c55e', '#47d6ff']
}

export default function FunConfetti({ active, legend }: FunConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!active || !legend || prefersReducedMotion || !canvasRef.current) return

    const burst = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true
    })
    const colors = CONFETTI_COLORS[legend.theme]

    burst({
      particleCount: 76,
      spread: 76,
      startVelocity: 30,
      gravity: 0.92,
      ticks: 96,
      scalar: 0.78,
      origin: { x: 0.5, y: 0.34 },
      colors,
      disableForReducedMotion: true
    })

    const timer = window.setTimeout(() => {
      const reset = (burst as { reset?: () => void }).reset
      reset?.()
    }, 1300)

    return () => {
      window.clearTimeout(timer)
      const reset = (burst as { reset?: () => void }).reset
      reset?.()
    }
  }, [active, legend, prefersReducedMotion])

  return <canvas ref={canvasRef} className="legend-confetti" aria-hidden="true" />
}
