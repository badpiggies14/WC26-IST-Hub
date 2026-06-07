import { MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { getTeam } from '../../data/teams'
import { downloadMatchIcs } from '../../lib/calendar'
import {
  formatInTimezone,
  formatMatchTimeIST,
  formatShortDateIST,
  formatUserLocalTime,
  formatVenueLocalTime,
  getVenueLocalTime,
  getWatchMeter
} from '../../lib/time'
import { useCountdown } from '../../hooks/useCountdown'
import { useAppStore } from '../../store/useAppStore'
import FavoriteButton from '../features/FavoriteButton'
import ReminderButton from '../features/ReminderButton'
import LiveBadge from './LiveBadge'
import TeamFlag from './TeamFlag'

function shortCountdown(timeLeft) {
  if (timeLeft.isOver) return 'Starting soon'
  if (timeLeft.days > 0) return `Starts in ${timeLeft.days}d ${timeLeft.hours}h`
  return `Starts in ${timeLeft.hours}h ${timeLeft.minutes}m`
}

export default function MatchCard({ match, variant = 'default' }) {
  const navigate = useNavigate()
  const liveMatches = useAppStore((state) => state.liveMatches)
  const favoriteTeams = useAppStore((state) => state.favoriteTeams)
  const favoriteMatches = useAppStore((state) => state.favoriteMatches)
  const timeDisplayMode = useAppStore((state) => state.timeDisplayMode || 'ist')
  const live = liveMatches[match.id]
  const isApiMatch = Boolean(match.dateUTC)
  const home = isApiMatch ? match.homeTeam : getTeam(match.home)
  const away = isApiMatch ? match.awayTeam : getTeam(match.away)
  const homeLabel = isApiMatch ? match.homeLabel : home.code
  const awayLabel = isApiMatch ? match.awayLabel : away.code
  const homeShort = home?.fifaCode || home?.shortName || home?.code || homeLabel
  const awayShort = away?.fifaCode || away?.shortName || away?.code || awayLabel
  const isLive = match.status === 'live'
  const isHalftime = match.status === 'halftime'
  const isFinished = match.status === 'finished'
  const dateUTC = isApiMatch ? match.dateUTC : new Date(`${match.date}T${match.timeIST}:00+05:30`).toISOString()
  const target = dateUTC
  const timeLeft = useCountdown(target)
  const minute = live?.minute || match.minute
  const homeScore = live?.homeScore ?? match.homeScore
  const awayScore = live?.awayScore ?? match.awayScore
  const watch = isApiMatch ? getWatchMeter(dateUTC) : null
  const isFavorite =
    favoriteMatches.includes(match.id) ||
    [home?.id, home?.fifaCode, away?.id, away?.fifaCode].filter(Boolean).some((value) => favoriteTeams.includes(value))

  const openDetail = () => {
    if (match.id) navigate(`/match/${match.id}`)
  }

  const supportingTimes = []
  if (isApiMatch && match.venue && ['venue', 'compare'].includes(timeDisplayMode)) {
    supportingTimes.push(['Venue', formatVenueLocalTime(dateUTC, match.venue)])
  }
  if (isApiMatch && ['my', 'compare'].includes(timeDisplayMode)) {
    supportingTimes.push(['My Time', formatUserLocalTime(dateUTC)])
  }
  if (isApiMatch && ['utc', 'compare'].includes(timeDisplayMode)) {
    supportingTimes.push(['UTC', `${formatInTimezone(dateUTC, 'UTC', 'EEE, MMM d, h:mm a')} UTC`])
  }

  return (
    <motion.article
      role="button"
      tabIndex={0}
      className={`match-card ${isLive || isHalftime ? 'match-card--live' : ''} ${isFinished ? 'match-card--finished' : ''} ${isFavorite ? 'match-card--favorite' : ''}`}
      data-tour="match-card"
      onClick={openDetail}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openDetail()
        }
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
    >
      <div className="match-card-head">
        <span className="card-kicker">{match.stage === 'group' || match.group ? `Group ${match.group}` : match.roundLabel || match.stage}</span>
        {isLive || isHalftime ? (
          <LiveBadge minute={minute} />
        ) : (
          <span className={`status-badge ${isFinished ? 'finished' : ''}`}>
            {isFinished ? 'FINISHED' : 'UPCOMING'}
          </span>
        )}
      </div>

      <div className="match-main">
        <div className="match-team">
          <TeamFlag code={match.home} team={home} size={variant === 'compact' ? 'small' : 'small'} />
          <span className="match-team-copy">
            <span className="match-team-name">{homeShort}</span>
            <span className="match-team-full">{homeLabel}</span>
          </span>
        </div>

        {isLive || isFinished ? (
          <div className="score">
            {homeScore ?? 0} - {awayScore ?? 0}
          </div>
        ) : (
          <div className="match-time-stack">
            <div className="match-time gold-time">{formatMatchTimeIST(dateUTC)}</div>
            <span>IST</span>
          </div>
        )}

        <div className="match-team away">
          <span className="match-team-copy">
            <span className="match-team-name">{awayShort}</span>
            <span className="match-team-full">{awayLabel}</span>
          </span>
          <TeamFlag code={match.away} team={away} size={variant === 'compact' ? 'small' : 'small'} />
        </div>
      </div>

      <div className="match-card-footer">
        <span title={match.venue}>
          <MapPin size={14} /> {isApiMatch ? match.venue?.name || 'Venue TBD' : match.venue}
        </span>
        <div className="card-actions">
          <FavoriteButton id={match.id} label={`${homeShort} vs ${awayShort} favorite`} />
          {isApiMatch ? <ReminderButton match={match} compact /> : null}
          {isLive ? <span className="round-badge">{minute}'</span> : null}
        </div>
      </div>

      <div className="match-card-footer" style={{ marginTop: 12 }}>
        <span>
          {formatShortDateIST(dateUTC)} • IST
          {isApiMatch && match.venue ? ` • Local ${getVenueLocalTime(dateUTC, match.venue.timezone)}` : ''}
        </span>
        {isFinished ? <span className="round-badge">FINAL</span> : <span className={`watch-badge ${watch?.snackMode ? 'late-night' : 'evening-prime'}`}>{watch?.label || match.watchMode}</span>}
      </div>

      {supportingTimes.length ? (
        <div className="match-time-support">
          {supportingTimes.map(([label, value]) => (
            <span key={label}>
              <strong>{label}:</strong> {value}
            </span>
          ))}
        </div>
      ) : null}

      {!isLive && !isFinished ? (
        <div className="match-card-footer" style={{ marginTop: 12 }}>
          <span className="round-badge">{shortCountdown(timeLeft)}</span>
          {isApiMatch ? (
            <button
              className="text-link"
              type="button"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                downloadMatchIcs(match)
              }}
            >
              Add to Calendar
            </button>
          ) : null}
        </div>
      ) : null}
    </motion.article>
  )
}
