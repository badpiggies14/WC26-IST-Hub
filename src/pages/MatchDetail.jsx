import { useParams } from 'react-router-dom'
import AddToCalendarButton from '../components/features/AddToCalendarButton'
import APIStatusBadge from '../components/features/APIStatusBadge'
import ReminderButton from '../components/features/ReminderButton'
import ShareMatchButton from '../components/features/ShareMatchButton'
import StadiumBackground from '../components/features/StadiumBackground'
import CountdownTimer from '../components/ui/CountdownTimer'
import TeamFlag from '../components/ui/TeamFlag'
import { formatMatchDateIST, formatMatchTimeIST, getVenueLocalTime, getWatchMeter } from '../lib/time'
import { useWorldCupData } from '../hooks/useWorldCupData'

function FormStrip({ values }) {
  return (
    <div className="form-strip">
      {values.map((value, index) => (
        <span className={`form-chip ${value === 'W' ? 'win' : value === 'D' ? 'draw' : 'loss'}`} key={`${value}-${index}`}>
          {value}
        </span>
      ))}
    </div>
  )
}

export default function MatchDetail() {
  const { id = '1' } = useParams()
  const match = useWorldCupData((state) => state.getMatchById(id))
  const isLoading = useWorldCupData((state) => state.isLoading)

  if (!match) {
    return (
      <div className="empty-state">
        <h2>{isLoading ? 'Loading Match' : 'Match Not Found'}</h2>
        <p>Try opening the schedule again. Cached data remains available if the API is offline.</p>
      </div>
    )
  }

  const watch = getWatchMeter(match.dateUTC)
  const homeScore = match.homeScore ?? 0
  const awayScore = match.awayScore ?? 0
  const showScore = match.status === 'live' || match.status === 'halftime' || match.status === 'finished'

  return (
    <>
      <StadiumBackground className="detail-hero">
        <div>
          <TeamFlag team={match.homeTeam} size="large" />
          <h1 className="detail-team-name">{match.homeTeam?.name || match.homeLabel}</h1>
          <div className="brand-subtitle">{match.homeTeam?.fifaCode || match.homeLabel}</div>
        </div>

        <div>
          <div className="round-badge">{match.status === 'live' ? `Live ${match.timeElapsed || ''}` : match.roundLabel}</div>
          <div className="detail-time-box" style={{ marginTop: 24 }}>
            <div className="detail-time-main">
              {showScore ? `${homeScore} - ${awayScore}` : formatMatchTimeIST(match.dateUTC)}
            </div>
            <div>{formatMatchDateIST(match.dateUTC)}</div>
            <div>{showScore ? `${formatMatchTimeIST(match.dateUTC)} IST` : 'IST Kickoff'}</div>
          </div>
          <div style={{ marginTop: 14 }}>
            <APIStatusBadge compact />
          </div>
        </div>

        <div>
          <TeamFlag team={match.awayTeam} size="large" />
          <h1 className="detail-team-name">{match.awayTeam?.name || match.awayLabel}</h1>
          <div className="brand-subtitle">{match.awayTeam?.fifaCode || match.awayLabel}</div>
        </div>
      </StadiumBackground>

      <div style={{ marginTop: 24 }}>
        <CountdownTimer targetDate={match.dateUTC} />
      </div>

      <div className="detail-grid">
        <div className="info-grid">
          <article className="info-card">
            <h3>Venue Info</h3>
            <p>{match.venue?.name || 'Venue TBD'}</p>
            <p style={{ color: 'var(--text-secondary)' }}>
              {match.venue ? `${match.venue.city}, ${match.venue.country}` : 'City TBD'}
            </p>
            <p className="brand-subtitle">
              {match.venue?.capacity ? `Capacity ${match.venue.capacity}` : 'Capacity TBD'} •{' '}
              {match.venue ? getVenueLocalTime(match.dateUTC, match.venue.timezone) : 'Local time TBD'}
            </p>
          </article>

          <article className="info-card">
            <h3>Watch Meter</h3>
            <p>{watch.label}</p>
            <p className="brand-subtitle">{watch.snackMode ? 'Snack Mode recommended' : 'Standard viewing window'}</p>
          </article>

          <article className="info-card">
            <h3>Goal Scorers</h3>
            {match.homeScorers.length || match.awayScorers.length ? (
              <p>
                {[...match.homeScorers, ...match.awayScorers].join(', ')}
              </p>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>Timeline placeholder - scorer feed pending.</p>
            )}
          </article>

          <article className="info-card">
            <h3>Recent Form</h3>
            <FormStrip values={['W', 'D', 'W', 'L', 'W']} />
          </article>
        </div>

        <aside className="panel-card">
          <h3>Match Actions</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            <ReminderButton match={match} />
            <ShareMatchButton match={match} />
            <AddToCalendarButton match={match} />
          </div>
        </aside>
      </div>
    </>
  )
}
