import type { Match, Team } from '../types/worldcup'
import { buildMatchDetails } from './calendar'
import { formatMatchDateIST, formatMatchTimeIST } from './time'

export async function copyText(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text)
    return true
  }

  return false
}

export async function shareMatch(match: Match) {
  const text = buildMatchDetails(match)

  if (navigator.share) {
    await navigator.share({
      title: `FIFA 2026: ${match.homeLabel} vs ${match.awayLabel}`,
      text
    })
    return 'native'
  }

  await copyText(text)
  return 'clipboard'
}

export async function shareTeamSchedule(team: Team, matches: Match[]) {
  const text = [
    `FIFA 2026 HUB - ${team.name} schedule`,
    ...matches.map((match) => `${formatMatchDateIST(match.dateUTC)} ${formatMatchTimeIST(match.dateUTC)} - ${match.homeLabel} vs ${match.awayLabel}`)
  ].join('\n')

  if (navigator.share) {
    await navigator.share({ title: `${team.name} World Cup 2026 schedule`, text })
    return 'native'
  }

  await copyText(text)
  return 'clipboard'
}
