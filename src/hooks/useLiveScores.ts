import { useEffect, useRef } from 'react'
import { formatDateKeyIST } from '../lib/time'
import { useWorldCupData } from './useWorldCupData'

function getPollingInterval(matches: ReturnType<typeof useWorldCupData.getState>['matches']) {
  const todayKey = formatDateKeyIST(new Date().toISOString())
  const hasLive = matches.some((match) => match.status === 'live' || match.status === 'halftime')
  const hasMatchToday = matches.some((match) => formatDateKeyIST(match.dateUTC) === todayKey)

  if (hasLive) return 30_000
  if (hasMatchToday) return 120_000
  return 600_000
}

export function useLiveScores() {
  const matches = useWorldCupData((state) => state.matches)
  const refresh = useWorldCupData((state) => state.refresh)
  const inFlight = useRef(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const runRefresh = async () => {
      if (document.hidden || inFlight.current) return

      inFlight.current = true
      abortRef.current?.abort()
      abortRef.current = new AbortController()

      try {
        await refresh({ signal: abortRef.current.signal })
      } finally {
        inFlight.current = false
      }
    }

    runRefresh()

    const interval = window.setInterval(runRefresh, getPollingInterval(matches))
    const onFocus = () => runRefresh()
    const onVisibility = () => {
      if (!document.hidden) runRefresh()
    }

    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
      abortRef.current?.abort()
    }
  }, [matches, refresh])
}
