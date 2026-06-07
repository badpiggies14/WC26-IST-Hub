import type { ApiGroup, GroupTable, Match, StandingRow, Team } from '../types/worldcup'

function emptyRow(team: Team): StandingRow {
  return {
    team,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0,
    zone: 'normal'
  }
}

function applyZones(rows: StandingRow[]): StandingRow[] {
  return rows.map((row, index) => ({
    ...row,
    zone: (index < 2 ? 'qualify' : index === 2 ? 'playoff' : 'normal') as StandingRow['zone']
  }))
}

function compareRows(a: StandingRow, b: StandingRow) {
  return b.points - a.points || b.gd - a.gd || b.gf - a.gf || a.team.name.localeCompare(b.team.name)
}

function parseApiGroupTables(groups: ApiGroup[], teamMap: Map<string, Team>): GroupTable[] | null {
  const parsed = groups
    .map((group) => {
      const groupName = String(group.name || group.group || group.group_name || '').replace(/^Group\s+/i, '')
      const rowsRaw = Array.isArray(group.teams)
        ? group.teams
        : Array.isArray(group.rows)
          ? group.rows
          : Array.isArray(group.table)
            ? group.table
            : []

      if (!groupName || !rowsRaw.length) return null

      const rows = rowsRaw
        .map((row: any): StandingRow | null => {
          const teamId = String(row.team_id || row.id || row.teamId || row.fifa_code || row.code || '')
          const team =
            teamMap.get(teamId) ||
            Array.from(teamMap.values()).find(
              (candidate) =>
                candidate.fifaCode === row.fifa_code ||
                candidate.shortName === row.code ||
                candidate.name === row.name ||
                candidate.name === row.team
            )
          if (!team) return null

          const played = Number(row.played ?? row.p ?? row.P ?? 0)
          const gf = Number(row.gf ?? row.goals_for ?? row.GF ?? 0)
          const ga = Number(row.ga ?? row.goals_against ?? row.GA ?? 0)
          const gd = Number(row.gd ?? row.goal_difference ?? row.GD ?? gf - ga)

          return {
            team,
            played,
            wins: Number(row.wins ?? row.w ?? row.W ?? 0),
            draws: Number(row.draws ?? row.d ?? row.D ?? 0),
            losses: Number(row.losses ?? row.l ?? row.L ?? 0),
            gf,
            ga,
            gd,
            points: Number(row.points ?? row.pts ?? row.Pts ?? 0),
            zone: 'normal'
          }
        })
        .filter(Boolean) as StandingRow[]

      if (!rows.length) return null

      return {
        group: groupName,
        rows: applyZones(rows.sort(compareRows)),
        source: 'api' as const
      }
    })
    .filter(Boolean) as GroupTable[]

  return parsed.length ? parsed : null
}

export function computeStandings(matches: Match[], teams: Team[], apiGroups: ApiGroup[] = []): GroupTable[] {
  const teamMap = new Map(teams.map((team) => [team.id, team]))
  const apiTables = parseApiGroupTables(apiGroups, teamMap)
  if (apiTables) return apiTables

  const groupTeams = teams.reduce<Record<string, Team[]>>((groups, team) => {
    if (!team.group) return groups
    groups[team.group] = [...(groups[team.group] || []), team]
    return groups
  }, {})

  const rowsByTeam = new Map<string, StandingRow>()
  teams.forEach((team) => rowsByTeam.set(team.id, emptyRow(team)))

  matches
    .filter((match) => match.stage === 'group' && match.status === 'finished')
    .forEach((match) => {
      const home = match.homeTeam ? rowsByTeam.get(match.homeTeam.id) : undefined
      const away = match.awayTeam ? rowsByTeam.get(match.awayTeam.id) : undefined
      if (!home || !away || match.homeScore === null || match.awayScore === null) return

      home.played += 1
      away.played += 1
      home.gf += match.homeScore
      home.ga += match.awayScore
      away.gf += match.awayScore
      away.ga += match.homeScore

      if (match.homeScore > match.awayScore) {
        home.wins += 1
        away.losses += 1
        home.points += 3
      } else if (match.homeScore < match.awayScore) {
        away.wins += 1
        home.losses += 1
        away.points += 3
      } else {
        home.draws += 1
        away.draws += 1
        home.points += 1
        away.points += 1
      }

      home.gd = home.gf - home.ga
      away.gd = away.gf - away.ga
    })

  return Object.entries(groupTeams)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([group, groupTeamList]) => ({
      group,
      rows: applyZones(groupTeamList.map((team) => rowsByTeam.get(team.id) || emptyRow(team)).sort(compareRows)),
      source: 'computed'
    }))
}
