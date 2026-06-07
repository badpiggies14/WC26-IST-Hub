import {
  formatInTimezone,
  formatMatchTimeIST,
  formatVenueLocalTime,
  formatUserLocalTime,
  getBrowserTimezone,
  getTimezoneAbbreviation,
  getTimezoneDateRolloverLabel,
  resolveVenueTimezone
} from '../../lib/time'
import type { Match } from '../../types/worldcup'
import TimezoneBadge from './TimezoneBadge'

type TimezoneComparePanelProps = {
  match: Match
  compact?: boolean
}

export default function TimezoneComparePanel({ match, compact = false }: TimezoneComparePanelProps) {
  const venueTimezone = resolveVenueTimezone(match.venue)
  const browserTimezone = getBrowserTimezone()
  const venueRollover = getTimezoneDateRolloverLabel(match.dateUTC, 'Asia/Kolkata', venueTimezone)
  const userRollover = getTimezoneDateRolloverLabel(match.dateUTC, 'Asia/Kolkata', browserTimezone)

  return (
    <section className={`timezone-panel ${compact ? 'compact' : ''}`}>
      <div className="timezone-panel-head">
        <span className="card-kicker">Timezone Compare</span>
        <strong>{match.venue?.timezone || venueTimezone}</strong>
      </div>
      <div className="timezone-panel-grid">
        <TimezoneBadge label="IST" value={`${formatMatchTimeIST(match.dateUTC)} IST`} tone="gold" />
        <TimezoneBadge label="Venue" value={formatVenueLocalTime(match.dateUTC, match.venue)} tone="blue" />
        <TimezoneBadge label="My Time" value={formatUserLocalTime(match.dateUTC)} />
        <TimezoneBadge
          label="UTC"
          value={`${formatInTimezone(match.dateUTC, 'UTC', 'EEE, MMM d, h:mm a')} ${getTimezoneAbbreviation(match.dateUTC, 'UTC')}`}
        />
      </div>
      {venueRollover || userRollover ? (
        <p className="timezone-rollover">
          {venueRollover ? `Venue: ${venueRollover}. ` : ''}
          {userRollover ? `My Time: ${userRollover}.` : ''}
        </p>
      ) : null}
    </section>
  )
}
