import { MATCHES as FALLBACK_MATCHES } from '../data/matches'
import { TEAMS as FALLBACK_TEAMS } from '../data/teams'
import { VENUES as FALLBACK_VENUES } from '../data/venues'
import { GROUPS as FALLBACK_GROUPS } from '../data/groups'
import {
  API_FALLBACK_GAMES,
  API_FALLBACK_GROUPS,
  API_FALLBACK_STADIUMS,
  API_FALLBACK_TEAMS
} from '../data/apiFallbackSnapshot'
import { CACHE_KEYS } from '../lib/storage'
import {
  normalizeApiData,
  normalizeFallbackMatch,
  normalizeFallbackTeam,
  normalizeFallbackVenue
} from '../lib/normalizers'
import type { ApiGame, ApiGroup, ApiMode, ApiStadium, ApiTeam, WorldCupDataset } from '../types/worldcup'
import { apiFetch, getWithCache } from './apiClient'

type GamesResponse = { games?: ApiGame[] } | ApiGame[]
type TeamsResponse = { teams?: ApiTeam[] } | ApiTeam[]
type StadiumsResponse = { stadiums?: ApiStadium[] } | ApiStadium[]
type GroupsResponse = { groups?: ApiGroup[] } | ApiGroup[]

const EXPECTED_MATCH_COUNT = 104

function extractGames(response: GamesResponse): ApiGame[] {
  return Array.isArray(response) ? response : response.games || []
}

function extractTeams(response: TeamsResponse): ApiTeam[] {
  return Array.isArray(response) ? response : response.teams || []
}

function extractStadiums(response: StadiumsResponse): ApiStadium[] {
  return Array.isArray(response) ? response : response.stadiums || []
}

function extractGroups(response: GroupsResponse): ApiGroup[] {
  return Array.isArray(response) ? response : response.groups || []
}

function buildFallbackDataset(status: ApiMode = 'offline', error?: string): WorldCupDataset {
  const apiFallback = normalizeApiData({
    games: API_FALLBACK_GAMES,
    teams: API_FALLBACK_TEAMS,
    stadiums: API_FALLBACK_STADIUMS,
    groups: API_FALLBACK_GROUPS
  })

  if (apiFallback.matches.length) {
    return {
      ...apiFallback,
      status,
      error
    }
  }

  const teams = FALLBACK_TEAMS.map(normalizeFallbackTeam)
  const venues = FALLBACK_VENUES.map(normalizeFallbackVenue)
  const teamMap = new Map(teams.map((team) => [team.id, team]))
  const venueMap = new Map<string, (typeof venues)[number]>()

  venues.forEach((venue) => {
    venueMap.set(venue.id, venue)
    venueMap.set(venue.name, venue)
  })

  return {
    teams,
    venues,
    groups: FALLBACK_GROUPS,
    matches: FALLBACK_MATCHES.map((match) => normalizeFallbackMatch(match, teamMap, venueMap)).sort(
      (a, b) => new Date(a.dateUTC).getTime() - new Date(b.dateUTC).getTime()
    ),
    status,
    error
  }
}

function combineStatuses(statuses: ApiMode[]): ApiMode {
  if (statuses.includes('auth')) return 'auth'
  if (statuses.includes('cached')) return 'cached'
  if (statuses.includes('offline')) return 'offline'
  if (statuses.includes('error')) return 'error'
  return 'live'
}

export async function getHealth(signal?: AbortSignal) {
  try {
    return await apiFetch('/health', { signal, retries: 1 })
  } catch {
    return apiFetch('/api/health', { signal, retries: 1 })
  }
}

export async function getGames(signal?: AbortSignal) {
  return getWithCache<GamesResponse>('/get/games', CACHE_KEYS.matches, { games: [] }, { signal })
}

export async function getTeams(group?: string, signal?: AbortSignal) {
  return getWithCache<TeamsResponse>(
    group ? `/get/teams?group=${encodeURIComponent(group)}` : '/get/teams',
    CACHE_KEYS.teams,
    { teams: [] },
    { signal }
  )
}

export async function getGroups(signal?: AbortSignal) {
  return getWithCache<GroupsResponse>('/get/groups', CACHE_KEYS.groups, { groups: [] }, { signal })
}

export async function getStadiums(signal?: AbortSignal) {
  return getWithCache<StadiumsResponse>('/get/stadiums', CACHE_KEYS.stadiums, { stadiums: [] }, { signal })
}

export async function getTeamByName(name: string, signal?: AbortSignal) {
  return getWithCache<TeamsResponse>(`/get/team?name=${encodeURIComponent(name)}`, CACHE_KEYS.teams, { teams: [] }, { signal })
}

export async function getStadiumById(id: string, signal?: AbortSignal) {
  return getWithCache<StadiumsResponse>(`/get/stadium/${encodeURIComponent(id)}`, CACHE_KEYS.stadiums, { stadiums: [] }, { signal })
}

export async function getWorldCupData(signal?: AbortSignal): Promise<WorldCupDataset> {
  const fallback = buildFallbackDataset()
  const [gamesResult, teamsResult, stadiumsResult, groupsResult] = await Promise.all([
    getGames(signal),
    getTeams(undefined, signal),
    getStadiums(signal),
    getGroups(signal)
  ])

  const status = combineStatuses([gamesResult.status, teamsResult.status, stadiumsResult.status, groupsResult.status])
  const error = [gamesResult.error, teamsResult.error, stadiumsResult.error, groupsResult.error].filter(Boolean).join(' ')
  const normalized = normalizeApiData({
    games: extractGames(gamesResult.data),
    teams: extractTeams(teamsResult.data),
    stadiums: extractStadiums(stadiumsResult.data),
    groups: extractGroups(groupsResult.data)
  })

  if (
    normalized.matches.length < EXPECTED_MATCH_COUNT ||
    !normalized.teams.length ||
    !normalized.venues.length
  ) {
    const fallbackStatus: ApiMode = status === 'auth' ? 'auth' : status === 'cached' ? 'cached' : 'offline'

    return {
      ...fallback,
      status: fallbackStatus,
      error: error || 'Live API returned incomplete data; using complete local fallback.'
    }
  }

  return {
    ...normalized,
    status,
    error: error || undefined,
    lastUpdated: Math.max(
      gamesResult.timestamp || 0,
      teamsResult.timestamp || 0,
      stadiumsResult.timestamp || 0,
      groupsResult.timestamp || 0
    )
  }
}

export async function getMatchByPublicId(id: string, signal?: AbortSignal) {
  const dataset = await getWorldCupData(signal)
  return dataset.matches.find((match) => match.id === id || String(match.matchNumber) === id)
}

export const fallbackWorldCupDataset = buildFallbackDataset('offline')
