import { fromZonedTime } from 'date-fns-tz'
import type { ApiGame, ApiGroup, ApiStadium, ApiTeam, Match, MatchStage, MatchStatus, Team, Venue } from '../types/worldcup'
import { IST_TIMEZONE, parseApiLocalDateToUtc, resolveVenueTimezone } from './time'

const stageLabels: Record<MatchStage, string> = {
  group: 'Group Stage',
  r32: 'Round of 32',
  r16: 'Round of 16',
  qf: 'Quarter-finals',
  sf: 'Semi-finals',
  third: 'Third Place',
  final: 'Final',
  unknown: 'Unknown Round'
}

const bigTeamCodes = new Set(['ARG', 'BRA', 'FRA', 'GER', 'ENG', 'ESP', 'POR', 'MEX', 'USA', 'NED', 'ITA'])

const teamDisplayAliases: Record<string, string> = {
  'Czech Republic': 'Czechia',
  Turkey: 'Türkiye',
  'Bosnia and Herzegovina': 'Bosnia-Herzegovina',
  'DR Congo': 'Congo DR',
  'Democratic Republic of the Congo': 'Congo DR',
  'CuraÃ§ao': 'Curaçao',
  Curacao: 'Curaçao'
}

const stadiumDisplayAliases: Record<string, string> = {
  'Estadio Azteca': 'Estadio Banorte'
}

function displayTeamName(name: string) {
  return teamDisplayAliases[name] || name
}

function displayStadiumName(name: string) {
  return stadiumDisplayAliases[name] || name
}

function cleanCityName(city: string) {
  return city
    .replace('Guadalajara (Zapopan)', 'Guadalajara')
    .replace('Monterrey (Guadalupe)', 'Guadalupe')
    .replace('Dallas (Arlington, Texas)', 'Arlington')
    .replace('Miami (Miami Gardens)', 'Miami Gardens')
    .replace('Boston (Foxborough)', 'Foxborough')
    .replace('New York/New Jersey (East Rutherford)', 'East Rutherford')
    .replace('San Francisco Bay Area (Santa Clara)', 'Santa Clara')
    .replace('Los Angeles (Inglewood)', 'Inglewood')
}

function numberOrNull(value: string | number | undefined): number | null {
  if (value === undefined || value === null || value === '' || value === 'null') return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function stringList(value?: string) {
  if (!value || value === 'null') return []
  return value
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function emojiFromIso2(iso2?: string) {
  if (!iso2 || iso2.length !== 2) return '🏳️'
  const codePoints = iso2
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

function stageFromType(type?: string): MatchStage {
  const normalized = String(type || '').toLowerCase()
  if (normalized === 'group') return 'group'
  if (normalized === 'r32') return 'r32'
  if (normalized === 'r16') return 'r16'
  if (normalized === 'qf') return 'qf'
  if (normalized === 'sf') return 'sf'
  if (normalized === 'third' || normalized === '3rd') return 'third'
  if (normalized === 'final') return 'final'
  return 'unknown'
}

function normalizeStatus(game: ApiGame, dateUTC: string): MatchStatus {
  const finished = String(game.finished).toUpperCase() === 'TRUE' || game.finished === true
  if (finished) return 'finished'

  const elapsed = String(game.time_elapsed || '').toLowerCase()
  if (!elapsed || elapsed === 'notstarted') return new Date(dateUTC).getTime() > Date.now() ? 'upcoming' : 'tbd'
  if (elapsed === 'halftime' || elapsed === 'ht') return 'halftime'
  if (elapsed === 'finished' || elapsed === 'fulltime' || elapsed === 'ft') return 'finished'
  if (/^\d{1,3}(\+\d{1,2})?$/.test(elapsed)) return 'live'

  return new Date(dateUTC).getTime() > Date.now() ? 'upcoming' : 'tbd'
}

function fallbackShortName(name?: string, fallback = 'TBD') {
  if (!name) return fallback
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.slice(0, 3).toUpperCase())
    .join('')
}

export function normalizeApiTeam(team: ApiTeam): Team {
  const isFlagUrl = Boolean(team.flag && /^https?:\/\//i.test(team.flag))
  const name = displayTeamName(team.name_en)
  const fifaCode = team.fifa_code || fallbackShortName(name)

  return {
    id: String(team.id),
    name,
    shortName: fifaCode,
    flag: isFlagUrl ? emojiFromIso2(team.iso2) : team.flag || emojiFromIso2(team.iso2),
    flagUrl: isFlagUrl ? team.flag : undefined,
    fifaCode,
    iso2: team.iso2,
    group: team.groups
  }
}

export function normalizeApiVenue(stadium: ApiStadium): Venue {
  const venue = {
    id: String(stadium.id),
    name: displayStadiumName(stadium.name_en),
    fifaName: stadium.fifa_name,
    city: cleanCityName(stadium.city_en),
    country: stadium.country_en,
    capacity: stadium.capacity,
    region: stadium.region,
    timezone: 'UTC'
  }

  return {
    ...venue,
    timezone: resolveVenueTimezone(venue)
  }
}

export function normalizeApiMatch(game: ApiGame, teamMap: Map<string, Team>, venueMap: Map<string, Venue>): Match {
  const venue = game.stadium_id ? venueMap.get(String(game.stadium_id)) : undefined
  const homeTeam = game.home_team_id && game.home_team_id !== '0' ? teamMap.get(String(game.home_team_id)) : undefined
  const awayTeam = game.away_team_id && game.away_team_id !== '0' ? teamMap.get(String(game.away_team_id)) : undefined
  const stage = stageFromType(game.type)
  const dateUTC = parseApiLocalDateToUtc(game.local_date, venue)
  const homeLabel = homeTeam?.name || game.home_team_name_en || game.home_team_label || 'TBD'
  const awayLabel = awayTeam?.name || game.away_team_name_en || game.away_team_label || 'TBD'

  return {
    id: String(game.id),
    matchNumber: Number(game.id) || 0,
    homeTeamId: String(game.home_team_id || ''),
    awayTeamId: String(game.away_team_id || ''),
    homeTeam,
    awayTeam,
    homeLabel: displayTeamName(homeLabel),
    awayLabel: displayTeamName(awayLabel),
    homeScore: numberOrNull(game.home_score),
    awayScore: numberOrNull(game.away_score),
    homeScorers: stringList(game.home_scorers),
    awayScorers: stringList(game.away_scorers),
    group: game.group,
    matchday: game.matchday,
    stage,
    roundLabel: stageLabels[stage],
    venueId: game.stadium_id,
    venue,
    dateUTC,
    localDateRaw: game.local_date,
    status: normalizeStatus(game, dateUTC),
    timeElapsed: game.time_elapsed,
    isBigMatch: stage !== 'group' || bigTeamCodes.has(homeTeam?.fifaCode || '') || bigTeamCodes.has(awayTeam?.fifaCode || '')
  }
}

export function normalizeApiData(payload: {
  games?: ApiGame[]
  teams?: ApiTeam[]
  stadiums?: ApiStadium[]
  groups?: ApiGroup[]
}) {
  const teams = (payload.teams || []).map(normalizeApiTeam)
  const venues = (payload.stadiums || []).map(normalizeApiVenue)
  const teamMap = new Map(teams.map((team) => [team.id, team]))
  const venueMap = new Map(venues.map((venue) => [venue.id, venue]))
  const matches = (payload.games || [])
    .map((game) => normalizeApiMatch(game, teamMap, venueMap))
    .sort((a, b) => new Date(a.dateUTC).getTime() - new Date(b.dateUTC).getTime())

  return {
    matches,
    teams,
    venues,
    groups: payload.groups || []
  }
}

export function normalizeFallbackTeam(team: any): Team {
  return {
    id: team.code,
    name: team.name || team.fullName || team.code,
    shortName: team.code,
    flag: team.flag || '🏳️',
    fifaCode: team.code,
    iso2: team.iso2,
    group: team.group
  }
}

export function normalizeFallbackVenue(venue: any): Venue {
  const normalized = {
    id: venue.id || venue.name,
    name: venue.name,
    fifaName: venue.display,
    city: venue.city,
    country: venue.country,
    capacity: Number(String(venue.capacity || '').replace(/,/g, '')) || undefined,
    region: venue.region,
    timezone: venue.timezone
  }

  return {
    ...normalized,
    timezone: resolveVenueTimezone(normalized)
  }
}

export function normalizeFallbackMatch(match: any, teamMap: Map<string, Team>, venueMap: Map<string, Venue>): Match {
  const matchNumber = Number(match.matchNumber || String(match.id).replace(/\D/g, '')) || 0
  const venue = venueMap.get(match.venue) || Array.from(venueMap.values())[0]
  const homeTeam = teamMap.get(match.home)
  const awayTeam = teamMap.get(match.away)
  const dateUTC = fromZonedTime(`${match.date}T${match.timeIST}:00`, IST_TIMEZONE).toISOString()
  const stage = stageFromType(match.round || (match.stage === 'Group Stage' ? 'group' : match.round))

  return {
    id: String(matchNumber || match.id),
    matchNumber,
    homeTeamId: match.home,
    awayTeamId: match.away,
    homeTeam,
    awayTeam,
    homeLabel: homeTeam?.name || match.home || 'TBD',
    awayLabel: awayTeam?.name || match.away || 'TBD',
    homeScore: numberOrNull(match.homeScore),
    awayScore: numberOrNull(match.awayScore),
    homeScorers: [],
    awayScorers: [],
    group: match.group,
    matchday: match.matchday,
    stage,
    roundLabel: stageLabels[stage],
    venueId: venue?.id,
    venue,
    dateUTC,
    localDateRaw: `${match.date} ${match.timeIST} IST`,
    status: match.status || 'upcoming',
    timeElapsed: match.minute ? String(match.minute) : match.timeElapsed,
    isBigMatch: stage !== 'group' || bigTeamCodes.has(homeTeam?.fifaCode || '') || bigTeamCodes.has(awayTeam?.fifaCode || '')
  }
}
