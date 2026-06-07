import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

type ScrollProgressPitchProps = {
  progress: number
  reducedMotion?: boolean
  forceVisible?: boolean
  className?: string
}

function FootballSvg() {
  return (
    <svg className="rolling-football-svg" viewBox="0 0 64 64" focusable="false" aria-hidden="true">
      <defs>
        <radialGradient id="footballSkin" cx="34%" cy="25%" r="72%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="58%" stopColor="#f2f5fb" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>
        <filter id="footballEdgeGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.4" floodColor="#47d6ff" floodOpacity="0.34" />
          <feDropShadow dx="0" dy="0" stdDeviation="1.1" floodColor="#e9c349" floodOpacity="0.26" />
        </filter>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#footballSkin)" stroke="#071122" strokeWidth="2.4" filter="url(#footballEdgeGlow)" />
      <path d="M32 16 43 24 39 37H25L21 24Z" fill="#071122" />
      <path d="M32 16v-8M43 24l7-6M39 37l8 8M25 37l-8 8M21 24l-7-6" stroke="#071122" strokeWidth="4" strokeLinecap="round" />
      <path d="M16 18c-5 6-7 14-5 22M48 18c5 6 7 14 5 22M18 50c8 5 20 5 28 0" fill="none" stroke="#071122" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M24 24 12 21M40 24l12-3M25 37l-9 10M39 37l9 10" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.78" />
      <path d="M23 11a26 26 0 0 1 18 0" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.72" />
    </svg>
  )
}

function useMeasuredTrack() {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [metrics, setMetrics] = useState({ width: 0, ballSize: 28 })

  useEffect(() => {
    const node = trackRef.current
    if (!node || typeof ResizeObserver === 'undefined') return

    const update = () => {
      const width = node.clientWidth
      const ballSize = Number.parseFloat(getComputedStyle(node).getPropertyValue('--football-size')) || 28
      setMetrics((current) => {
        if (Math.abs(current.width - width) < 1 && Math.abs(current.ballSize - ballSize) < 1) return current
        return { width, ballSize }
      })
    }

    const observer = new ResizeObserver(update)
    observer.observe(node)
    update()

    return () => observer.disconnect()
  }, [])

  return { trackRef, metrics }
}

export default function ScrollProgressPitch({
  progress,
  reducedMotion = false,
  forceVisible = false,
  className = ''
}: ScrollProgressPitchProps) {
  const { trackRef, metrics } = useMeasuredTrack()
  const clampedProgress = Math.min(1, Math.max(0, progress))
  const travel = Math.max(0, metrics.width - metrics.ballSize)
  const rotation = reducedMotion ? 0 : clampedProgress * 1440
  const style = useMemo(
    () =>
      ({
        '--football-progress': String(clampedProgress),
        '--football-x': `${clampedProgress * travel}px`,
        '--football-rotation': `${rotation}deg`
      }) as CSSProperties,
    [clampedProgress, rotation, travel]
  )

  return (
    <div
      aria-hidden="true"
      className={`rolling-football-wrapper ${forceVisible ? 'force-visible' : ''} ${className}`.trim()}
      style={style}
    >
      <div ref={trackRef} className="rolling-football-track">
        <div className="pitch-line" />
        <div className="pitch-goal pitch-goal-left" />
        <div className="pitch-center-mark" />
        <div className="pitch-center-circle" />
        <div className="pitch-goal pitch-goal-right" />
        <div className="rolling-football-progress-glow" />
        <div className="rolling-football-streak rolling-football-streak-a" />
        <div className="rolling-football-streak rolling-football-streak-b" />
        <div className="rolling-football-ball">
          <FootballSvg />
        </div>
      </div>
    </div>
  )
}
