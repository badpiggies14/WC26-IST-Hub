import { useEffect, useRef, useState } from 'react'

function clamp(value: number) {
  return Math.min(1, Math.max(0, value))
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const frameRef = useRef<number | null>(null)
  const lastProgressRef = useRef(-1)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const measure = () => {
      frameRef.current = null

      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const nextProgress = scrollable <= 0 ? 0 : clamp(window.scrollY / scrollable)

      if (Math.abs(nextProgress - lastProgressRef.current) < 0.002) return
      lastProgressRef.current = nextProgress
      setProgress(nextProgress)
    }

    const scheduleMeasure = () => {
      if (frameRef.current !== null) return
      frameRef.current = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', scheduleMeasure, { passive: true })
    window.addEventListener('resize', scheduleMeasure)

    return () => {
      window.removeEventListener('scroll', scheduleMeasure)
      window.removeEventListener('resize', scheduleMeasure)
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return progress
}
