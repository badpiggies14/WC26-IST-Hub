export type ApiGame = {
  _id?: string
  id: string
  home_team_id: string
  away_team_id: string
  home_score?: string | number
  away_score?: string | number
  home_scorers?: string
  away_scorers?: string
  group?: string
  matchday?: string
  local_date?: string
  persian_date?: string
  stadium_id?: string
  finished?: string | boolean
  time_elapsed?: string
  type?: string
  home_team_label?: string
  away_team_label?: string
  home_team_name_en?: string
  away_team_name_en?: string
}

export type ApiTeam = {
  _id?: string
  id: string
  name_en: string
  name_fa?: string
  flag?: string
  fifa_code?: string
  iso2?: string
  groups?: string
}

export type ApiStadium = {
  _id?: string
  id: string
  name_en: string
  name_fa?: string
  fifa_name?: string
  city_en: string
  country_en: string
  capacity?: number
  region?: string
}

export type ApiGroup = Record<string, unknown>

export type Team = {
  id: string
  name: string
  shortName: string
  flag: string
  flagUrl?: string
  fifaCode?: string
  iso2?: string
  group?: string
}

export type Venue = {
  id: string
  name: string
  fifaName?: string
  city: string
  country: string
  capacity?: number
  region?: string
  timezone: string
}

export type MatchStatus =
  | 'upcoming'
  | 'live'
  | 'halftime'
  | 'finished'
  | 'postponed'
  | 'cancelled'
  | 'tbd'

export type MatchStage = 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'third' | 'final' | 'unknown'

export type Match = {
  id: string
  matchNumber: number
  homeTeamId: string
  awayTeamId: string
  homeTeam?: Team
  awayTeam?: Team
  homeLabel?: string
  awayLabel?: string
  homeScore: number | null
  awayScore: number | null
  homeScorers: string[]
  awayScorers: string[]
  group?: string
  matchday?: string
  stage: MatchStage
  roundLabel: string
  venueId?: string
  venue?: Venue
  dateUTC: string
  localDateRaw?: string
  status: MatchStatus
  timeElapsed?: string
  isBigMatch: boolean
}

export type ApiStatus = 'idle' | 'loading' | 'live' | 'cached' | 'offline' | 'auth' | 'error'

export type ApiMode = 'live' | 'cached' | 'offline' | 'auth' | 'error'

export type CachedResult<T> = {
  data: T
  status: ApiMode
  error?: string
  timestamp?: number
}

export type WorldCupDataset = {
  matches: Match[]
  teams: Team[]
  venues: Venue[]
  groups: ApiGroup[]
  status: ApiMode
  error?: string
  lastUpdated?: number
}

export type StandingRow = {
  team: Team
  played: number
  wins: number
  draws: number
  losses: number
  gf: number
  ga: number
  gd: number
  points: number
  zone: 'qualify' | 'playoff' | 'normal'
}

export type GroupTable = {
  group: string
  rows: StandingRow[]
  source: 'api' | 'computed' | 'fallback'
}

export type WatchMeter = {
  label: 'Evening Match' | 'Late Night' | 'Midnight Madness' | 'Early Morning Grind' | 'Day Match'
  snackMode: boolean
}
