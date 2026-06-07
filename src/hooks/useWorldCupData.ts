import { create } from 'zustand'
import { computeStandings } from '../lib/standings'
import { getWorldCupData, fallbackWorldCupDataset } from '../services/worldCupApi'
import type { ApiGroup, ApiStatus, GroupTable, Match, Team, Venue } from '../types/worldcup'

type RefreshOptions = {
  signal?: AbortSignal
}

type WorldCupDataState = {
  matches: Match[]
  teams: Team[]
  stadiums: Venue[]
  groups: ApiGroup[]
  groupTables: GroupTable[]
  matchMap: Map<string, Match>
  teamMap: Map<string, Team>
  venueMap: Map<string, Venue>
  apiStatus: ApiStatus
  isLoading: boolean
  error?: string
  lastUpdated?: number
  refresh: (options?: RefreshOptions) => Promise<void>
  getMatchById: (id: string) => Match | undefined
  getTeamById: (id: string) => Team | undefined
  getVenueById: (id: string) => Venue | undefined
  getMatchesForTeam: (idOrCode: string) => Match[]
}

function derive(dataset: typeof fallbackWorldCupDataset) {
  const matchMap = new Map<string, Match>()
  dataset.matches.forEach((match) => {
    matchMap.set(match.id, match)
    matchMap.set(String(match.matchNumber), match)
  })

  const teamMap = new Map<string, Team>()
  dataset.teams.forEach((team) => {
    teamMap.set(team.id, team)
    if (team.fifaCode) teamMap.set(team.fifaCode, team)
    teamMap.set(team.shortName, team)
  })

  const venueMap = new Map<string, Venue>()
  dataset.venues.forEach((venue) => {
    venueMap.set(venue.id, venue)
    venueMap.set(venue.name, venue)
  })

  return {
    matchMap,
    teamMap,
    venueMap,
    groupTables: computeStandings(dataset.matches, dataset.teams, dataset.groups)
  }
}

const initialDerived = derive(fallbackWorldCupDataset)

export const useWorldCupData = create<WorldCupDataState>((set, get) => ({
  matches: fallbackWorldCupDataset.matches,
  teams: fallbackWorldCupDataset.teams,
  stadiums: fallbackWorldCupDataset.venues,
  groups: fallbackWorldCupDataset.groups,
  groupTables: initialDerived.groupTables,
  matchMap: initialDerived.matchMap,
  teamMap: initialDerived.teamMap,
  venueMap: initialDerived.venueMap,
  apiStatus: 'idle',
  isLoading: false,
  error: undefined,
  lastUpdated: fallbackWorldCupDataset.lastUpdated,

  refresh: async (options = {}) => {
    set((state) => ({ isLoading: true, apiStatus: state.apiStatus === 'idle' ? 'loading' : state.apiStatus }))

    try {
      const dataset = await getWorldCupData(options.signal)
      const derived = derive(dataset)
      set({
        matches: dataset.matches,
        teams: dataset.teams,
        stadiums: dataset.venues,
        groups: dataset.groups,
        groupTables: derived.groupTables,
        matchMap: derived.matchMap,
        teamMap: derived.teamMap,
        venueMap: derived.venueMap,
        apiStatus: dataset.status,
        isLoading: false,
        error: dataset.error,
        lastUpdated: dataset.lastUpdated || Date.now()
      })
    } catch (error) {
      if (options.signal?.aborted) {
        set({ isLoading: false })
        return
      }

      set({
        apiStatus: 'error',
        isLoading: false,
        error: error instanceof Error ? error.message : 'Could not refresh World Cup data.'
      })
    }
  },

  getMatchById: (id) => get().matchMap.get(id),
  getTeamById: (id) => get().teamMap.get(id),
  getVenueById: (id) => get().venueMap.get(id),
  getMatchesForTeam: (idOrCode) => {
    const team = get().teamMap.get(idOrCode)
    if (!team) return []
    return get().matches.filter(
      (match) =>
        match.homeTeam?.id === team.id ||
        match.awayTeam?.id === team.id ||
        match.homeTeam?.fifaCode === team.fifaCode ||
        match.awayTeam?.fifaCode === team.fifaCode
    )
  }
}))
