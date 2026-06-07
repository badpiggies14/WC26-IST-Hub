import { AlarmClock, ArrowRight } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import APIStatusBadge from '../components/features/APIStatusBadge'
import ReminderButton from '../components/features/ReminderButton'
import StadiumBackground from '../components/features/StadiumBackground'
import LegendFlagSurprise from '../components/fun/LegendFlagSurprise'
import TimeDisplayModeToggle from '../components/time/TimeDisplayModeToggle'
import CountdownTimer from '../components/ui/CountdownTimer'
import MatchCard from '../components/ui/MatchCard'
import TeamFlag from '../components/ui/TeamFlag'
import { REPLAY_TUTORIAL_EVENT } from '../hooks/useProductTour'
import { formatDateKeyIST, formatMatchDateIST, formatMatchTimeIST, getWatchMeter } from '../lib/time'
import { useWorldCupData } from '../hooks/useWorldCupData'
import { useAppStore } from '../store/useAppStore'

function byKickoff(a, b) {
  return new Date(a.dateUTC).getTime() - new Date(b.dateUTC).getTime()
}

export default function Home() {
  const matches = useWorldCupData((state) => state.matches)
  const isLoading = useWorldCupData((state) => state.isLoading)
  const lastUpdated = useWorldCupData((state) => state.lastUpdated)
  const favoriteTeams = useAppStore((state) => state.favoriteTeams)

  const now = Date.now()
  const todayKey = formatDateKeyIST(new Date().toISOString())

  const liveMatches = useMemo(
    () => matches.filter((match) => match.status === 'live' || match.status === 'halftime').sort(byKickoff),
    [matches]
  )
  const todayMatches = useMemo(
    () => matches.filter((match) => formatDateKeyIST(match.dateUTC) === todayKey).sort(byKickoff),
    [matches, todayKey]
  )
  const nextMatch = useMemo(
    () => matches.filter((match) => new Date(match.dateUTC).getTime() >= now).sort(byKickoff)[0] || matches[0],
    [matches, now]
  )
  const upcoming = useMemo(
    () =>
      matches
        .filter((match) => match.status === 'upcoming' && match.id !== nextMatch?.id)
        .sort(byKickoff)
        .slice(0, 3),
    [matches, nextMatch]
  )
  const favoriteTeamMatches = useMemo(
    () =>
      matches
        .filter((match) =>
          [match.homeTeam?.id, match.homeTeam?.fifaCode, match.awayTeam?.id, match.awayTeam?.fifaCode]
            .filter(Boolean)
            .some((value) => favoriteTeams.includes(value))
        )
        .sort(byKickoff)
        .slice(0, 3),
    [favoriteTeams, matches]
  )

  const watch = nextMatch ? getWatchMeter(nextMatch.dateUTC) : null

  return (
    <>
      <StadiumBackground className="home-hero">
        <div className="hero-copy">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
            <APIStatusBadge />
            <span className="round-badge">Today in IST: {todayMatches.length} matches</span>
          </div>
          <h1 className="hero-title">
            World Cup 2026 Match Schedule <span className="gold">In IST</span>
          </h1>
          <p className="hero-body">
            Every match, every team, every kickoff - converted from venue-local API data into Indian Standard Time for
            Indian fans.
          </p>
          <CountdownTimer targetDate={nextMatch?.dateUTC || '2026-06-11T00:30:00+05:30'} />
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/schedule">
              View Today's Matches
            </Link>
            <Link className="btn btn-ghost" to="/favorites">
              Pick Favorite Teams
            </Link>
            <button className="btn btn-ghost" type="button" onClick={() => window.dispatchEvent(new Event(REPLAY_TUTORIAL_EVENT))}>
              Show Tutorial
            </button>
          </div>
          <TimeDisplayModeToggle />
          <div className="hero-tournament-strip" aria-label="World Cup 2026 quick facts">
            <span>48 Nations</span>
            <span>104 Fixtures</span>
            <span>IST First</span>
          </div>
        </div>

        <div className="world-cup-hero-art" aria-hidden="true">
          <div className="trophy-orbit" />
          <img src="/brand/world-cup-trophy.webp" alt="" />
          <div className="trophy-caption">
            <span>Road to Glory</span>
            <strong>World Cup 2026</strong>
          </div>
        </div>

        <div className="hero-side-stack">
          {nextMatch ? (
            <article className="glass-card opening-card" data-tour="next-match-card">
              <div className="opening-top">
                <span className="card-kicker">Next Fixture</span>
                <span className="card-kicker">{nextMatch.roundLabel}</span>
              </div>
              <div className="opening-teams">
                <div>
                  <TeamFlag team={nextMatch.homeTeam} size="medium" />
                  <div className="team-code">{nextMatch.homeTeam?.fifaCode || nextMatch.homeLabel}</div>
                </div>
                <div>
                  <div className="opening-time">{formatMatchTimeIST(nextMatch.dateUTC)}</div>
                  <div className="opening-meta">{formatMatchDateIST(nextMatch.dateUTC)}</div>
                  <span className={`watch-badge ${watch?.snackMode ? 'late-night' : 'evening-prime'}`}>
                    {watch?.snackMode ? 'SNACK MODE' : watch?.label}
                  </span>
                </div>
                <div>
                  <TeamFlag team={nextMatch.awayTeam} size="medium" />
                  <div className="team-code">{nextMatch.awayTeam?.fifaCode || nextMatch.awayLabel}</div>
                </div>
              </div>
              <div className="opening-venue">
                {nextMatch.venue ? `${nextMatch.venue.name}, ${nextMatch.venue.city}` : 'Venue TBD'}
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                <ReminderButton match={nextMatch} />
                <Link className="btn btn-ghost" to={`/match/${nextMatch.id}`}>
                  <AlarmClock /> Match Center
                </Link>
              </div>
            </article>
          ) : null}
          <LegendFlagSurprise />
        </div>
      </StadiumBackground>

      <div className="section-row">
        <h2 className="section-title">Live Matches</h2>
        <span className="brand-subtitle">
          Last updated {lastUpdated ? new Date(lastUpdated).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'pending'}
        </span>
      </div>
      {liveMatches.length ? (
        <div className="featured-grid">
          {liveMatches.slice(0, 3).map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>{isLoading ? 'Loading Live Matches' : 'No Live Matches Right Now'}</h2>
          <p>The next kickoff remains visible above, and polling will speed up on match days.</p>
        </div>
      )}

      <div className="section-row">
        <h2 className="section-title">Featured Upcoming</h2>
        <Link className="text-link" to="/schedule">
          View Full Schedule <ArrowRight size={14} />
        </Link>
      </div>
      <div className="featured-grid">
        {upcoming.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      {favoriteTeamMatches.length ? (
        <>
          <div className="section-row">
            <h2 className="section-title">Favorite Team Matches</h2>
          </div>
          <div className="featured-grid">
            {favoriteTeamMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </>
      ) : null}
    </>
  )
}
