import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { MATCHES } from '../data/matches'
import { useAppStore } from '../store/useAppStore'

export function useLiveMatch() {
  const liveMatches = useAppStore((state) => state.liveMatches)
  const setLiveMatch = useAppStore((state) => state.setLiveMatch)
  const favoriteTeams = useAppStore((state) => state.favoriteTeams)
  const goalAlertsEnabled = useAppStore((state) => state.goalAlertsEnabled)

  useEffect(() => {
    const timer = setInterval(() => {
      MATCHES.filter((match) => match.status === 'live').forEach((match) => {
        const current = liveMatches[match.id] || {
          minute: match.minute || 1,
          homeScore: match.homeScore || 0,
          awayScore: match.awayScore || 0
        }
        const nextMinute = Math.min(90, current.minute + 1)
        const favoriteInMatch = favoriteTeams.includes(match.home) || favoriteTeams.includes(match.away)
        const scoreBump = goalAlertsEnabled && favoriteInMatch && nextMinute % 17 === 0

        if (scoreBump) {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.78 },
            colors: ['#e9c349', '#47d6ff', '#22c55e']
          })
        }

        setLiveMatch(match.id, {
          minute: nextMinute,
          homeScore: current.homeScore + (scoreBump ? 1 : 0),
          awayScore: current.awayScore
        })
      })
    }, 60000)

    return () => clearInterval(timer)
  }, [favoriteTeams, goalAlertsEnabled, liveMatches, setLiveMatch])

  return liveMatches
}
