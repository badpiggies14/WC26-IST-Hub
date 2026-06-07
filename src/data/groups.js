import { GROUP_DEFINITIONS, getTeam } from './teams'

const templates = [
  [
    { played: 3, gd: 4, points: 7 },
    { played: 3, gd: 2, points: 6 },
    { played: 3, gd: -1, points: 3 },
    { played: 3, gd: -5, points: 1 }
  ],
  [
    { played: 3, gd: 5, points: 9 },
    { played: 3, gd: 1, points: 6 },
    { played: 3, gd: -2, points: 3 },
    { played: 3, gd: -4, points: 0 }
  ],
  [
    { played: 3, gd: 6, points: 9 },
    { played: 3, gd: 1, points: 4 },
    { played: 3, gd: -2, points: 3 },
    { played: 3, gd: -5, points: 1 }
  ]
]

export const GROUPS = Object.entries(GROUP_DEFINITIONS).map(([group, codes], groupIndex) => ({
  group,
  name: `Group ${group}`,
  matchday: '3/3',
  teams: codes.map((code, index) => {
    const team = getTeam(code)
    const stat = templates[groupIndex % templates.length][index]
    return {
      rank: index + 1,
      code,
      name: team.name,
      flag: team.flag,
      played: stat.played,
      gd: stat.gd,
      points: stat.points,
      zone: index < 2 ? 'qualify' : index === 2 ? 'playoff' : 'normal'
    }
  })
}))
