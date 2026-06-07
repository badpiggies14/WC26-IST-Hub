import { Search, Star, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import FavoriteButton from '../components/features/FavoriteButton'
import TeamFlag from '../components/ui/TeamFlag'
import { formatMatchDateIST, formatMatchTimeIST } from '../lib/time'
import { useWorldCupData } from '../hooks/useWorldCupData'
import { useAppStore } from '../store/useAppStore'
import { useMemo, useState } from 'react'

const groups = ['all', ...'ABCDEFGHIJKL'.split('')]

function getTeamFixtures(matches, team) {
  return matches
    .filter(
      (match) =>
        match.homeTeam?.id === team.id ||
        match.awayTeam?.id === team.id ||
        match.homeTeam?.fifaCode === team.fifaCode ||
        match.awayTeam?.fifaCode === team.fifaCode
    )
    .sort((a, b) => new Date(a.dateUTC).getTime() - new Date(b.dateUTC).getTime())
}

function TeamCard({ team, matches, favorite }) {
  const fixtures = getTeamFixtures(matches, team)
  const nextMatch = fixtures.find((match) => new Date(match.dateUTC).getTime() >= Date.now())

  return (
    <Link className={`team-card ${favorite ? 'favorite' : ''}`} to={`/team/${team.fifaCode || team.id}`}>
      <div className="team-card-head">
        <TeamFlag team={team} size="medium" />
        <FavoriteButton type="team" id={team.fifaCode || team.id} label={`Favorite ${team.name}`} />
      </div>
      <div>
        <span className="round-badge">Group {team.group || 'TBD'}</span>
        <h2>{team.name}</h2>
        <p>
          {team.fifaCode || team.shortName} · {fixtures.length} fixtures
        </p>
      </div>
      <div className="team-card-next">
        {nextMatch ? (
          <>
            <strong>Next Match</strong>
            <span>
              {nextMatch.homeTeam?.fifaCode || nextMatch.homeLabel} vs{' '}
              {nextMatch.awayTeam?.fifaCode || nextMatch.awayLabel}
            </span>
            <small>
              {formatMatchDateIST(nextMatch.dateUTC)} · {formatMatchTimeIST(nextMatch.dateUTC)} IST
            </small>
          </>
        ) : (
          <>
            <strong>Knockout Path</strong>
            <span>Awaiting tournament progress</span>
            <small>Schedule updates from API data</small>
          </>
        )}
      </div>
    </Link>
  )
}

export default function Teams() {
  const teams = useWorldCupData((state) => state.teams)
  const matches = useWorldCupData((state) => state.matches)
  const isLoading = useWorldCupData((state) => state.isLoading)
  const favoriteTeams = useAppStore((state) => state.favoriteTeams)
  const [query, setQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState('all')

  const filteredTeams = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return teams
      .filter((team) => {
        const groupMatches = activeGroup === 'all' || team.group === activeGroup
        const searchMatches =
          !normalizedQuery ||
          [team.name, team.fifaCode, team.shortName, team.group]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery)

        return groupMatches && searchMatches
      })
      .sort((a, b) => `${a.group || 'Z'}-${a.name}`.localeCompare(`${b.group || 'Z'}-${b.name}`))
  }, [activeGroup, query, teams])

  return (
    <>
      <header className="page-header teams-page-header">
        <div>
          <span className="round-badge">
            <Users size={14} /> 48 Nations
          </span>
          <h1 className="page-title">Teams</h1>
          <p className="page-subtitle">Explore every World Cup 2026 country with flags, groups, fixtures, and IST-first match timing.</p>
        </div>
        <div className="teams-hero-stats">
          <strong>{teams.length || 48}</strong>
          <span>Qualified Teams</span>
        </div>
      </header>

      <section className="teams-toolbar" aria-label="Team filters">
        <label className="teams-search">
          <Search size={18} />
          <input
            type="search"
            value={query}
            placeholder="Search country, FIFA code, group..."
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="teams-group-filter" role="tablist" aria-label="Filter teams by group">
          {groups.map((group) => (
            <button
              key={group}
              className={`tab-pill ${activeGroup === group ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveGroup(group)}
            >
              {group === 'all' ? 'All Groups' : `Group ${group}`}
            </button>
          ))}
        </div>
      </section>

      <div className="teams-count-row">
        <span className="round-badge">
          Showing {filteredTeams.length} {filteredTeams.length === 1 ? 'team' : 'teams'}
        </span>
        <span>
          <Star size={15} /> Favorite up to 5 teams for quick match tracking.
        </span>
      </div>

      {filteredTeams.length ? (
        <section className="teams-grid">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              matches={matches}
              favorite={favoriteTeams.includes(team.fifaCode) || favoriteTeams.includes(team.id)}
            />
          ))}
        </section>
      ) : (
        <div className="empty-state">
          <h2>{isLoading ? 'Loading Teams' : 'No Teams Found'}</h2>
          <p>Try another group or search term. All 48 countries are available from live API/cache/fallback data.</p>
        </div>
      )}
    </>
  )
}
