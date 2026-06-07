import { RefreshCw } from 'lucide-react'
import { useMemo } from 'react'
import APIStatusBadge from '../components/features/APIStatusBadge'
import LegendFlagSurprise from '../components/fun/LegendFlagSurprise'
import MatchCard from '../components/ui/MatchCard'
import { formatDateKeyIST, formatMatchDateIST, formatMatchTimeIST, groupMatchesByISTDate } from '../lib/time'
import { useWorldCupData } from '../hooks/useWorldCupData'
import { useAppStore } from '../store/useAppStore'

const baseFilters = [
  ['all', 'All'],
  ['today', 'Today'],
  ['tomorrow', 'Tomorrow'],
  ['live', 'Live'],
  ['upcoming', 'Upcoming'],
  ['finished', 'Finished'],
  ['favorites', 'Favorites'],
  ['group-stage', 'Group Stage'],
  ['knockouts', 'Knockouts'],
  ['r32', 'Round of 32'],
  ['r16', 'Round of 16'],
  ['qf', 'Quarterfinals'],
  ['sf', 'Semifinals'],
  ['final', 'Final']
]

const groupFilters = 'ABCDEFGHIJKL'.split('').map((group) => [`group-${group}`, `Group ${group}`])
const filters = [...baseFilters, ...groupFilters]

function tomorrowKey() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return formatDateKeyIST(tomorrow.toISOString())
}

function matchesSearch(match, query) {
  if (!query) return true
  const haystack = [
    match.id,
    match.matchNumber,
    match.group,
    match.roundLabel,
    match.stage,
    match.homeLabel,
    match.awayLabel,
    match.homeTeam?.name,
    match.awayTeam?.name,
    match.homeTeam?.fifaCode,
    match.awayTeam?.fifaCode,
    match.venue?.name,
    match.venue?.city
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return haystack.includes(query)
}

export default function Schedule() {
  const matches = useWorldCupData((state) => state.matches)
  const isLoading = useWorldCupData((state) => state.isLoading)
  const refresh = useWorldCupData((state) => state.refresh)
  const activeFilter = useAppStore((state) => state.activeFilter)
  const setActiveFilter = useAppStore((state) => state.setActiveFilter)
  const favoriteMatches = useAppStore((state) => state.favoriteMatches)
  const favoriteTeams = useAppStore((state) => state.favoriteTeams)
  const searchQuery = useAppStore((state) => state.searchQuery).trim().toLowerCase()

  const filteredMatches = useMemo(() => {
    const today = formatDateKeyIST(new Date().toISOString())
    const tomorrow = tomorrowKey()

    return matches
      .filter((match) => {
        const dateKey = formatDateKeyIST(match.dateUTC)
        const favorite =
          favoriteMatches.includes(match.id) ||
          [match.homeTeam?.id, match.homeTeam?.fifaCode, match.awayTeam?.id, match.awayTeam?.fifaCode]
            .filter(Boolean)
            .some((value) => favoriteTeams.includes(value))

        if (!matchesSearch(match, searchQuery)) return false
        if (activeFilter === 'today') return dateKey === today
        if (activeFilter === 'tomorrow') return dateKey === tomorrow
        if (activeFilter === 'live') return match.status === 'live' || match.status === 'halftime'
        if (activeFilter === 'upcoming') return match.status === 'upcoming'
        if (activeFilter === 'finished') return match.status === 'finished'
        if (activeFilter === 'favorites') return favorite
        if (activeFilter === 'group-stage') return match.stage === 'group'
        if (activeFilter === 'knockouts') return match.stage !== 'group'
        if (['r32', 'r16', 'qf', 'sf', 'final'].includes(activeFilter)) return match.stage === activeFilter
        if (activeFilter.startsWith('group-')) return match.group === activeFilter.replace('group-', '')
        return true
      })
      .sort((a, b) => new Date(a.dateUTC).getTime() - new Date(b.dateUTC).getTime())
  }, [activeFilter, favoriteMatches, favoriteTeams, matches, searchQuery])

  const grouped = groupMatchesByISTDate(filteredMatches)
  const groupEntries = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b))

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Match Schedule</h1>
          <p className="mono-note">All visible kickoff times are converted to Asia/Kolkata from venue-local API data.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <APIStatusBadge />
          <button className="btn btn-ghost" type="button" onClick={() => refresh()}>
            <RefreshCw /> Refresh
          </button>
        </div>
      </header>

      <div className="schedule-fun-strip">
        <LegendFlagSurprise compact />
      </div>

      <div className="filter-tabs" role="tablist" aria-label="Schedule filters">
        {filters.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`tab-pill ${activeFilter === id ? 'active' : ''}`}
            onClick={() => setActiveFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="schedule-summary" aria-live="polite">
        <span className="round-badge">
          Showing {filteredMatches.length} {activeFilter === 'all' ? 'total' : activeFilter.replace('-', ' ')} matches
        </span>
      </div>

      {groupEntries.length > 0 ? (
        groupEntries.map(([dateKey, dayMatches]) => (
          <section className="day-section" key={dateKey}>
            <div className="sticky-day-header">
              <h2 className="day-heading">
                {formatMatchDateIST(dayMatches[0].dateUTC)} • {dayMatches.length} matches
              </h2>
              <span className="round-badge">First kickoff {formatMatchTimeIST(dayMatches[0].dateUTC)} IST</span>
            </div>
            <div className="schedule-grid">
              {dayMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="empty-state">
          <h2>{isLoading ? 'Loading Schedule' : 'No Matches Found'}</h2>
          <p>Try another filter or clear search. Cached or fallback data will remain available if the API is down.</p>
        </div>
      )}
    </>
  )
}
