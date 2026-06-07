export const GROUP_DEFINITIONS = {
  A: ['USA', 'JPN', 'ALG', 'SWE'],
  B: ['MEX', 'CRO', 'KSA', 'GHA'],
  C: ['CAN', 'KOR', 'NOR', 'NZL'],
  D: ['NED', 'COL', 'PAN', 'JOR'],
  E: ['ENG', 'AUS', 'PAR', 'COD'],
  F: ['GER', 'URU', 'TUN', 'IDN'],
  G: ['ARG', 'MAR', 'SCO', 'CUR'],
  H: ['POR', 'ECU', 'RSA', 'TUR'],
  I: ['ESP', 'SEN', 'QAT', 'DEN'],
  J: ['BEL', 'AUT', 'CIV', 'HAI'],
  K: ['BRA', 'IRN', 'EGY', 'ITA'],
  L: ['FRA', 'SUI', 'UZB', 'CPV']
}

const argentinaSquad = [
  { number: 23, name: 'E. Martinez', position: 'GOALKEEPER' },
  { number: 19, name: 'N. Otamendi', position: 'DEFENDER' },
  { number: 7, name: 'R. De Paul', position: 'MIDFIELDER' },
  { number: 9, name: 'J. Alvarez', position: 'FORWARD' },
  { number: 10, name: 'L. Messi', position: 'FORWARD' },
  { number: 11, name: 'A. Di Maria', position: 'FORWARD' },
  { number: 8, name: 'E. Fernandez', position: 'MIDFIELDER' }
]

export const TEAMS = [
  { code: 'USA', name: 'USA', fullName: 'United States', flag: '🇺🇸', group: 'A', nickname: 'The Stars and Stripes' },
  { code: 'JPN', name: 'Japan', fullName: 'Japan', flag: '🇯🇵', group: 'A', nickname: 'Samurai Blue' },
  { code: 'ALG', name: 'Algeria', fullName: 'Algeria', flag: '🇩🇿', group: 'A', nickname: 'Desert Warriors' },
  { code: 'SWE', name: 'Sweden', fullName: 'Sweden', flag: '🇸🇪', group: 'A', nickname: 'Blagult' },
  { code: 'MEX', name: 'Mexico', fullName: 'Mexico', flag: '🇲🇽', group: 'B', nickname: 'El Tri' },
  { code: 'CRO', name: 'Croatia', fullName: 'Croatia', flag: '🇭🇷', group: 'B', nickname: 'Vatreni' },
  { code: 'KSA', name: 'Saudi Arabia', fullName: 'Saudi Arabia', flag: '🇸🇦', group: 'B', nickname: 'Green Falcons' },
  { code: 'GHA', name: 'Ghana', fullName: 'Ghana', flag: '🇬🇭', group: 'B', nickname: 'Black Stars' },
  { code: 'CAN', name: 'Canada', fullName: 'Canada', flag: '🇨🇦', group: 'C', nickname: 'The Canucks' },
  { code: 'KOR', name: 'South Korea', fullName: 'South Korea', flag: '🇰🇷', group: 'C', nickname: 'Taegeuk Warriors' },
  { code: 'NOR', name: 'Norway', fullName: 'Norway', flag: '🇳🇴', group: 'C', nickname: 'Landslaget' },
  { code: 'NZL', name: 'New Zealand', fullName: 'New Zealand', flag: '🇳🇿', group: 'C', nickname: 'All Whites' },
  { code: 'NED', name: 'Netherlands', fullName: 'Netherlands', flag: '🇳🇱', group: 'D', nickname: 'Oranje' },
  { code: 'COL', name: 'Colombia', fullName: 'Colombia', flag: '🇨🇴', group: 'D', nickname: 'Los Cafeteros' },
  { code: 'PAN', name: 'Panama', fullName: 'Panama', flag: '🇵🇦', group: 'D', nickname: 'Los Canaleros' },
  { code: 'JOR', name: 'Jordan', fullName: 'Jordan', flag: '🇯🇴', group: 'D', nickname: 'The Chivalrous' },
  { code: 'ENG', name: 'England', fullName: 'England', flag: '🏴', group: 'E', nickname: 'Three Lions' },
  { code: 'AUS', name: 'Australia', fullName: 'Australia', flag: '🇦🇺', group: 'E', nickname: 'Socceroos' },
  { code: 'PAR', name: 'Paraguay', fullName: 'Paraguay', flag: '🇵🇾', group: 'E', nickname: 'La Albirroja' },
  { code: 'COD', name: 'DR Congo', fullName: 'DR Congo', flag: '🇨🇩', group: 'E', nickname: 'The Leopards' },
  { code: 'GER', name: 'Germany', fullName: 'Germany', flag: '🇩🇪', group: 'F', nickname: 'Die Mannschaft' },
  { code: 'URU', name: 'Uruguay', fullName: 'Uruguay', flag: '🇺🇾', group: 'F', nickname: 'La Celeste' },
  { code: 'TUN', name: 'Tunisia', fullName: 'Tunisia', flag: '🇹🇳', group: 'F', nickname: 'Eagles of Carthage' },
  { code: 'IDN', name: 'Indonesia', fullName: 'Indonesia', flag: '🇮🇩', group: 'F', nickname: 'Garuda' },
  {
    code: 'ARG',
    name: 'Argentina',
    fullName: 'Argentina',
    flag: '🇦🇷',
    group: 'G',
    nickname: 'La Albiceleste',
    subtitle: 'La Albiceleste • Current World Champions',
    captain: { name: 'L. Messi', goals: 106, caps: 180 },
    squad: argentinaSquad,
    recentResults: [
      { competition: 'WC QUALIFIER', date: '17 OCT', opponent: 'PERU', score: '0 - 2', side: 'away' },
      { competition: 'WC QUALIFIER', date: '12 OCT', opponent: 'PARAGUAY', score: '1 - 0', side: 'home' }
    ]
  },
  { code: 'MAR', name: 'Morocco', fullName: 'Morocco', flag: '🇲🇦', group: 'G', nickname: 'Atlas Lions' },
  { code: 'SCO', name: 'Scotland', fullName: 'Scotland', flag: '🏴', group: 'G', nickname: 'The Tartan Army' },
  { code: 'CUR', name: 'Curacao', fullName: 'Curacao', flag: '🇨🇼', group: 'G', nickname: 'La Familia Azul' },
  { code: 'POR', name: 'Portugal', fullName: 'Portugal', flag: '🇵🇹', group: 'H', nickname: 'Selecao das Quinas' },
  { code: 'ECU', name: 'Ecuador', fullName: 'Ecuador', flag: '🇪🇨', group: 'H', nickname: 'La Tri' },
  { code: 'RSA', name: 'South Africa', fullName: 'South Africa', flag: '🇿🇦', group: 'H', nickname: 'Bafana Bafana' },
  { code: 'TUR', name: 'Turkey', fullName: 'Turkey', flag: '🇹🇷', group: 'H', nickname: 'Crescent Stars' },
  { code: 'ESP', name: 'Spain', fullName: 'Spain', flag: '🇪🇸', group: 'I', nickname: 'La Roja' },
  { code: 'SEN', name: 'Senegal', fullName: 'Senegal', flag: '🇸🇳', group: 'I', nickname: 'Lions of Teranga' },
  { code: 'QAT', name: 'Qatar', fullName: 'Qatar', flag: '🇶🇦', group: 'I', nickname: 'The Maroons' },
  { code: 'DEN', name: 'Denmark', fullName: 'Denmark', flag: '🇩🇰', group: 'I', nickname: 'Danish Dynamite' },
  { code: 'BEL', name: 'Belgium', fullName: 'Belgium', flag: '🇧🇪', group: 'J', nickname: 'Red Devils' },
  { code: 'AUT', name: 'Austria', fullName: 'Austria', flag: '🇦🇹', group: 'J', nickname: 'Das Team' },
  { code: 'CIV', name: 'Ivory Coast', fullName: 'Ivory Coast', flag: '🇨🇮', group: 'J', nickname: 'The Elephants' },
  { code: 'HAI', name: 'Haiti', fullName: 'Haiti', flag: '🇭🇹', group: 'J', nickname: 'Les Grenadiers' },
  { code: 'BRA', name: 'Brazil', fullName: 'Brazil', flag: '🇧🇷', group: 'K', nickname: 'Selecao' },
  { code: 'IRN', name: 'Iran', fullName: 'Iran', flag: '🇮🇷', group: 'K', nickname: 'Team Melli' },
  { code: 'EGY', name: 'Egypt', fullName: 'Egypt', flag: '🇪🇬', group: 'K', nickname: 'The Pharaohs' },
  { code: 'ITA', name: 'Italy', fullName: 'Italy', flag: '🇮🇹', group: 'K', nickname: 'Azzurri' },
  { code: 'FRA', name: 'France', fullName: 'France', flag: '🇫🇷', group: 'L', nickname: 'Les Bleus' },
  { code: 'SUI', name: 'Switzerland', fullName: 'Switzerland', flag: '🇨🇭', group: 'L', nickname: 'Nati' },
  { code: 'UZB', name: 'Uzbekistan', fullName: 'Uzbekistan', flag: '🇺🇿', group: 'L', nickname: 'White Wolves' },
  { code: 'CPV', name: 'Cape Verde', fullName: 'Cape Verde', flag: '🇨🇻', group: 'L', nickname: 'Blue Sharks' }
].map((team) => ({
  squad: [],
  captain: { name: 'Captain TBA', goals: 0, caps: 0 },
  recentResults: [],
  subtitle: `${team.nickname} • Group ${team.group}`,
  ...team
}))

export const TEAM_MAP = Object.fromEntries(TEAMS.map((team) => [team.code, team]))

export function getTeam(code) {
  return TEAM_MAP[code] || {
    code,
    name: code || 'TBD',
    fullName: code || 'TBD',
    flag: '🏳️',
    group: 'TBD',
    nickname: 'To be decided',
    subtitle: 'Tournament placement pending',
    captain: { name: 'Captain TBA', goals: 0, caps: 0 },
    squad: [],
    recentResults: []
  }
}

export function getTeamsByGroup(group) {
  return (GROUP_DEFINITIONS[group] || []).map(getTeam)
}
