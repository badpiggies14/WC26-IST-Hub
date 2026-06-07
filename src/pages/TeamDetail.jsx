import { MapPin, Share2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import FavoriteButton from '../components/features/FavoriteButton'
import TeamFlag from '../components/ui/TeamFlag'
import CountdownTimer from '../components/ui/CountdownTimer'
import MatchCard from '../components/ui/MatchCard'
import { formatMatchDateIST, formatMatchTimeIST } from '../lib/time'
import { shareTeamSchedule } from '../lib/share'
import { useWorldCupData } from '../hooks/useWorldCupData'

function FixtureCard({ match, index }) {
  return (
    <article className={`fixture-card ${index === 0 ? 'next' : ''}`}>
      <div className="split-row">
        <span className="brand-subtitle">
          {formatMatchDateIST(match.dateUTC)} • {formatMatchTimeIST(match.dateUTC)} IST
        </span>
        <span className="round-badge">Match {match.matchNumber}</span>
      </div>
      <div className="fixture-score-line">
        <span>{match.homeTeam?.fifaCode || match.homeLabel}</span>
        <span className="round-badge">VS</span>
        <span style={{ textAlign: 'right' }}>{match.awayTeam?.fifaCode || match.awayLabel}</span>
      </div>
      <p style={{ color: 'var(--text-secondary)' }}>
        <MapPin size={16} /> {match.venue?.name || 'Venue TBD'}
      </p>
    </article>
  )
}

export default function TeamDetail() {
  const { code = 'ARG' } = useParams()
  const team = useWorldCupData((state) => state.getTeamById(code))
  const matches = useWorldCupData((state) => (team ? state.getMatchesForTeam(team.id) : []))
  const groupTables = useWorldCupData((state) => state.groupTables)
  const isLoading = useWorldCupData((state) => state.isLoading)

  if (!team) {
    return (
      <div className="empty-state">
        <h2>{isLoading ? 'Loading Team' : 'Team Not Found'}</h2>
        <p>Try selecting the team from standings or schedule.</p>
      </div>
    )
  }

  const sortedMatches = matches.sort((a, b) => new Date(a.dateUTC).getTime() - new Date(b.dateUTC).getTime())
  const nextMatch = sortedMatches.find((match) => new Date(match.dateUTC).getTime() >= Date.now())
  const results = sortedMatches.filter((match) => match.status === 'finished')
  const groupPosition =
    groupTables
      .find((group) => group.group === team.group)
      ?.rows.findIndex((row) => row.team.id === team.id) + 1 || null

  return (
    <>
      <section className="team-hero">
        <TeamFlag team={team} size="large" />
        <div>
          <span className="round-badge">Group {team.group || 'TBD'}</span>
          <h1 className="team-title">{team.name}</h1>
          <p className="hero-body" style={{ margin: 0 }}>
            {team.fifaCode || team.shortName} • {groupPosition ? `Group position #${groupPosition}` : 'Group position pending'}
          </p>
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          <div>
            <FavoriteButton type="team" id={team.fifaCode || team.id} label={`Favorite ${team.name}`} />
            <span className="btn btn-ghost" style={{ marginLeft: 8 }}>
              Favorite Team
            </span>
          </div>
          <button className="btn btn-ghost" type="button" onClick={() => shareTeamSchedule(team, sortedMatches)}>
            <Share2 /> Share Schedule
          </button>
        </div>
      </section>

      {nextMatch ? (
        <article className="panel-card" style={{ marginTop: 24 }}>
          <div className="split-row">
            <h3 style={{ margin: 0 }}>Next Match Countdown</h3>
            <Link className="text-link" to={`/match/${nextMatch.id}`}>
              Match Center
            </Link>
          </div>
          <CountdownTimer targetDate={nextMatch.dateUTC} />
        </article>
      ) : null}

      <div className="team-detail-grid">
        <main>
          <div className="section-row" style={{ marginTop: 0 }}>
            <h2 className="section-title">All Fixtures <span className="brand-subtitle">(IST)</span></h2>
            <Link className="text-link" to="/schedule">
              View All
            </Link>
          </div>

          {sortedMatches.length > 0 ? (
            <div className="fixture-list">
              {sortedMatches.slice(0, 6).map((match, index) => (
                <FixtureCard key={match.id} match={match} index={index} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No Fixtures Yet</h2>
              <p>Knockout placement will populate once the group phase is settled.</p>
            </div>
          )}

          <div className="section-row">
            <h2 className="section-title">Results</h2>
          </div>
          {results.length ? (
            <div className="featured-grid">
              {results.slice(0, 3).map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No Results Yet</h2>
              <p>Finished match results will appear here during the tournament.</p>
            </div>
          )}
        </main>

        <aside>
          <article className="panel-card">
            <h3>Team Data</h3>
            <div className="squad-list">
              <div className="squad-player">
                <span className="number-badge">{team.fifaCode || team.shortName}</span>
                <div>
                  <strong>{team.name}</strong>
                  <div className="brand-subtitle">FIFA Code</div>
                </div>
              </div>
              <div className="squad-player">
                <span className="number-badge">{team.group || '-'}</span>
                <div>
                  <strong>Group {team.group || 'TBD'}</strong>
                  <div className="brand-subtitle">Tournament Group</div>
                </div>
              </div>
              <div className="squad-player">
                <span className="number-badge">{matches.length}</span>
                <div>
                  <strong>Fixtures</strong>
                  <div className="brand-subtitle">From API Schedule</div>
                </div>
              </div>
            </div>
          </article>
        </aside>
      </div>
    </>
  )
}
