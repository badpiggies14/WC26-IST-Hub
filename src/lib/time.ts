import { formatInTimeZone, fromZonedTime } from 'date-fns-tz'
import type { Match, Venue, WatchMeter } from '../types/worldcup'

export const IST_TIMEZONE = 'Asia/Kolkata'

const cityTimezoneRules: Array<{ test: RegExp; timezone: string }> = [
  { test: /mexico city|guadalajara|monterrey|azteca|akron|bbva/i, timezone: 'America/Mexico_City' },
  { test: /dallas|arlington|at&t|houston|nrg|kansas|arrowhead/i, timezone: 'America/Chicago' },
  {
    test: /atlanta|mercedes|miami|hard rock|boston|foxborough|gillette|philadelphia|lincoln|new york|new jersey|east rutherford|metlife|toronto|bmo/i,
    timezone: 'America/New_York'
  },
  {
    test: /los angeles|inglewood|sofi|san francisco|santa clara|levi|seattle|lumen|vancouver|bc place/i,
    timezone: 'America/Los_Angeles'
  }
]

function pad(value: string | number) {
  return String(value).padStart(2, '0')
}

export function resolveVenueTimezone(
  venue?: Pick<Venue, 'name' | 'fifaName' | 'city' | 'country' | 'region' | 'timezone'>
): string {
  if (venue?.timezone && venue.timezone.includes('/')) return venue.timezone

  const haystack = `${venue?.name || ''} ${venue?.fifaName || ''} ${venue?.city || ''} ${venue?.country || ''} ${venue?.region || ''}`
  const rule = cityTimezoneRules.find((item) => item.test.test(haystack))

  if (rule) return rule.timezone

  if (import.meta.env.DEV) {
    console.warn('[FIFA 2026 HUB] Unknown venue timezone, falling back to UTC:', venue)
  }

  return 'UTC'
}

export function parseApiLocalDateToUtc(localDateRaw?: string, venue?: Venue): string {
  if (!localDateRaw) return new Date('2026-06-11T00:00:00Z').toISOString()

  const match = localDateRaw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/)
  if (!match) return new Date(localDateRaw).toISOString()

  const [, month, day, year, hour, minute] = match
  const localIso = `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00`
  return fromZonedTime(localIso, resolveVenueTimezone(venue)).toISOString()
}

export function formatMatchTimeIST(dateUTC: string) {
  return formatInTimeZone(dateUTC, IST_TIMEZONE, 'hh:mm a')
}

export function formatMatchDateIST(dateUTC: string) {
  return formatInTimeZone(dateUTC, IST_TIMEZONE, 'EEEE, d MMMM yyyy')
}

export function formatMatchDateTimeIST(dateUTC: string) {
  return `${formatMatchDateIST(dateUTC)} — ${formatMatchTimeIST(dateUTC)} IST`
}

export function formatInTimezone(dateUTC: string, timezone: string, pattern = 'EEE, MMM d, h:mm a') {
  return formatInTimeZone(dateUTC, timezone || 'UTC', pattern)
}

export function formatShortDateIST(dateUTC: string) {
  return formatInTimeZone(dateUTC, IST_TIMEZONE, 'EEE, d MMM')
}

export function formatDateKeyIST(dateUTC: string) {
  return formatInTimeZone(dateUTC, IST_TIMEZONE, 'yyyy-MM-dd')
}

export function groupMatchesByISTDate(matches: Match[]) {
  return matches.reduce<Record<string, Match[]>>((groups, match) => {
    const key = formatDateKeyIST(match.dateUTC)
    groups[key] = [...(groups[key] || []), match]
    return groups
  }, {})
}

export function getVenueLocalTime(dateUTC: string, timezone = 'UTC') {
  const cityLabel = timezone.split('/').pop()?.replace(/_/g, ' ') || 'local'
  return `${formatInTimeZone(dateUTC, timezone, 'EEE, MMM d, h:mm a')} ${cityLabel}`
}

export function formatVenueLocalTime(dateUTC: string, venue?: Venue) {
  const timezone = resolveVenueTimezone(venue)
  const city = venue?.city || timezone.split('/').pop()?.replace(/_/g, ' ') || 'Venue'
  return `${formatInTimezone(dateUTC, timezone, 'EEE, MMM d, h:mm a')} ${city}`
}

export function getBrowserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || IST_TIMEZONE
  } catch {
    return IST_TIMEZONE
  }
}

export function formatUserLocalTime(dateUTC: string) {
  const timezone = getBrowserTimezone()
  return `${formatInTimezone(dateUTC, timezone, 'EEE, MMM d, h:mm a')} ${timezone}`
}

export function getTimezoneAbbreviation(dateUTC: string, timezone: string) {
  try {
    return formatInTimezone(dateUTC, timezone, 'zzz')
  } catch {
    return timezone === 'UTC' ? 'UTC' : timezone
  }
}

export function getTimezoneDateRolloverLabel(dateUTC: string, primaryTz: string, comparisonTz: string) {
  const primaryDate = formatInTimezone(dateUTC, primaryTz, 'yyyy-MM-dd')
  const comparisonDate = formatInTimezone(dateUTC, comparisonTz, 'yyyy-MM-dd')

  if (primaryDate === comparisonDate) return ''
  return comparisonDate > primaryDate ? 'Next day there' : 'Previous day there'
}

export function getCountdownParts(dateUTC: string) {
  const diff = new Date(dateUTC).getTime() - Date.now()

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true }

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    isOver: false
  }
}

export function getWatchMeter(dateUTC: string): WatchMeter {
  const hour = Number(formatInTimeZone(dateUTC, IST_TIMEZONE, 'H'))

  if (hour >= 18 && hour <= 21) return { label: 'Evening Match', snackMode: false }
  if (hour >= 22 && hour <= 23) return { label: 'Late Night', snackMode: true }
  if (hour >= 0 && hour <= 2) return { label: 'Midnight Madness', snackMode: true }
  if (hour >= 3 && hour <= 5) return { label: 'Early Morning Grind', snackMode: true }
  return { label: 'Day Match', snackMode: false }
}

export function isMatchTodayIST(dateUTC: string) {
  return formatDateKeyIST(dateUTC) === formatDateKeyIST(new Date().toISOString())
}

export function isMatchTomorrowIST(dateUTC: string) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return formatDateKeyIST(dateUTC) === formatDateKeyIST(tomorrow.toISOString())
}
