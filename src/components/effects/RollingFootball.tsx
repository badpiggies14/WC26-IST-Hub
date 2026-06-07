import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import ScrollProgressPitch from './ScrollProgressPitch'

export type RollingFootballProps = {
  className?: string
  forceVisible?: boolean
}

export const ROLLING_FOOTBALL_STORAGE_KEY = 'wc2026_rolling_ball_enabled'
export const ROLLING_FOOTBALL_EVENT = 'wc2026:rolling-football-setting'

function readRollingFootballPreference(prefersReducedMotion: boolean) {
  if (typeof window === 'undefined') return !prefersReducedMotion

  try {
    const stored = window.localStorage.getItem(ROLLING_FOOTBALL_STORAGE_KEY)
    if (stored === null) return !prefersReducedMotion
    return stored === 'true'
  } catch {
    return !prefersReducedMotion
  }
}

function usePageScrollability(forceVisible = false) {
  const [scrollable, setScrollable] = useState(forceVisible)
  const location = useLocation()

  useEffect(() => {
    if (forceVisible) {
      setScrollable(true)
      return
    }

    let frame = 0
    const measure = () => {
      frame = 0
      const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight
      setScrollable(scrollableDistance > 120)
    }

    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(measure)
    }

    schedule()
    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', schedule, { passive: true })

    return () => {
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [forceVisible, location.pathname])

  return scrollable
}

export default function RollingFootball({ className = '', forceVisible = false }: RollingFootballProps) {
  const progress = useScrollProgress()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [enabled, setEnabled] = useState(() => readRollingFootballPreference(false))
  const scrollable = usePageScrollability(forceVisible)

  useEffect(() => {
    setEnabled(readRollingFootballPreference(prefersReducedMotion))

    const updatePreference = () => {
      setEnabled(readRollingFootballPreference(prefersReducedMotion))
    }

    window.addEventListener('storage', updatePreference)
    window.addEventListener(ROLLING_FOOTBALL_EVENT, updatePreference)

    return () => {
      window.removeEventListener('storage', updatePreference)
      window.removeEventListener(ROLLING_FOOTBALL_EVENT, updatePreference)
    }
  }, [prefersReducedMotion])

  const shouldRender = useMemo(() => enabled && (scrollable || forceVisible), [enabled, forceVisible, scrollable])

  if (!shouldRender) return null

  return (
    <ScrollProgressPitch
      className={className}
      forceVisible={forceVisible}
      progress={progress}
      reducedMotion={prefersReducedMotion}
    />
  )
}
