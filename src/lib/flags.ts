import type { Team } from '../types/worldcup'

const isoAliases: Record<string, string> = {
  USA: 'US',
  'UNITED STATES': 'US',
  'SOUTH KOREA': 'KR',
  'KOREA REPUBLIC': 'KR',
  CZECHIA: 'CZ',
  'CZECH REPUBLIC': 'CZ',
  TURKIYE: 'TR',
  TURKEY: 'TR',
  'CONGO DR': 'CD',
  'D. R. CONGO': 'CD',
  'DR CONGO': 'CD',
  'IVORY COAST': 'CI',
  "COTE D'IVOIRE": 'CI',
  'BOSNIA-HERZEGOVINA': 'BA',
  'BOSNIA AND HERZEGOVINA': 'BA',
  'CAPE VERDE': 'CV',
  'CABO VERDE': 'CV',
  CURACAO: 'CW',
  CURAÇAO: 'CW',
  SCOTLAND: 'GB-SCT',
  SCO: 'GB-SCT',
  ENGLAND: 'GB-ENG',
  ENG: 'GB-ENG'
}

const regionalEmoji: Record<string, string> = {
  'GB-SCT': '🏴',
  'GB-ENG': '🏴'
}

const regionalFlagAssets: Record<string, string> = {
  'GB-SCT': 'gb-sct',
  'GB-ENG': 'gb-eng'
}

export function isoToEmoji(iso2?: string) {
  if (!iso2) return ''
  const normalized = iso2.toUpperCase()
  if (regionalEmoji[normalized]) return regionalEmoji[normalized]
  if (normalized.length !== 2) return ''

  return String.fromCodePoint(...normalized.split('').map((char) => 127397 + char.charCodeAt(0)))
}

export function resolveIso2(team?: Partial<Team> | null) {
  if (!team) return ''
  const direct = team.iso2?.toUpperCase()
  if (direct && regionalFlagAssets[direct]) return direct
  if (direct && direct.length === 2) return direct

  const keys = [team.fifaCode, team.shortName, team.name].filter(Boolean).map((value) => String(value).toUpperCase())

  for (const key of keys) {
    if (isoAliases[key]) return isoAliases[key]
  }

  return ''
}

export function getFlagSources(team?: Partial<Team> | null) {
  const iso2 = resolveIso2(team)
  const sources: string[] = []
  const regionalAsset = regionalFlagAssets[iso2]

  if (team?.flagUrl && /^https?:\/\//i.test(team.flagUrl)) sources.push(team.flagUrl)

  if (regionalAsset) {
    sources.push(`/flags/${regionalAsset}.svg`)
    sources.push(`https://flagcdn.com/${regionalAsset}.svg`)
    return sources
  }

  if (iso2 && iso2.length === 2) {
    const code = iso2.toLowerCase()
    sources.push(`/flags/${code}.svg`)
    sources.push(`https://flagcdn.com/${code}.svg`)
    sources.push(`https://flagcdn.com/w80/${code}.png`)
  }

  return sources
}

export function getFlagEmoji(team?: Partial<Team> | null) {
  return team?.flag || isoToEmoji(resolveIso2(team))
}

export function getTeamInitials(team?: Partial<Team> | null, fallbackLabel = 'TBD') {
  return team?.fifaCode || team?.shortName || fallbackLabel.slice(0, 3).toUpperCase()
}
