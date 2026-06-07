import { GROUP_DEFINITIONS } from './teams'
import { VENUES } from './venues'

const IST_SLOTS = [
  { timeIST: '00:30', timeLabel: 'AM', watchMode: 'LATE_NIGHT' },
  { timeIST: '03:30', timeLabel: 'AM', watchMode: 'LATE_NIGHT' },
  { timeIST: '06:30', timeLabel: 'AM', watchMode: 'EARLY_BIRD' },
  { timeIST: '22:30', timeLabel: 'PM', watchMode: 'PRIME_TIME' }
]

const PAIRINGS = [
  [0, 1],
  [2, 3],
  [0, 2],
  [1, 3],
  [0, 3],
  [1, 2]
]

export const WATCH_MODE_LABELS = {
  LATE_NIGHT: 'LATE NIGHT WATCH',
  SNACK_MODE: 'SNACK MODE',
  EARLY_BIRD: 'EARLY BIRD',
  EVENING_PRIME: 'EVENING PRIME',
  PRIME_TIME: 'PRIME TIME'
}

function addDays(dateString, amount) {
  const date = new Date(`${dateString}T00:00:00+05:30`)
  date.setDate(date.getDate() + amount)
  return date.toISOString().slice(0, 10)
}

function idFromNumber(number) {
  return `M${String(number).padStart(3, '0')}`
}

function venueFor(index) {
  const venue = VENUES[index % VENUES.length]
  return {
    venue: venue.name,
    city: venue.city,
    country: venue.country
  }
}

function groupDateFor(index) {
  const dayOffset = Math.floor((index * 22) / 72)
  return addDays('2026-06-11', dayOffset)
}

function statusForGroupMatch(index) {
  return { status: 'upcoming', homeScore: null, awayScore: null, minute: null }
}

function buildGroupMatches() {
  const matches = []
  let globalIndex = 0

  Object.entries(GROUP_DEFINITIONS).forEach(([group, codes]) => {
    PAIRINGS.forEach(([homeIndex, awayIndex]) => {
      const slot = IST_SLOTS[globalIndex % IST_SLOTS.length]
      const status = statusForGroupMatch(globalIndex)
      const openingOverride = globalIndex === 0

      matches.push({
        id: idFromNumber(globalIndex + 1),
        group,
        stage: 'Group Stage',
        date: openingOverride ? '2026-06-12' : groupDateFor(globalIndex),
        ...slot,
        timeIST: openingOverride ? '00:30' : slot.timeIST,
        timeLabel: openingOverride ? 'AM' : slot.timeLabel,
        watchMode: openingOverride ? 'LATE_NIGHT' : slot.watchMode,
        home: openingOverride ? 'MEX' : codes[homeIndex],
        away: openingOverride ? 'RSA' : codes[awayIndex],
        ...venueFor(openingOverride ? 0 : globalIndex),
        status: status.status,
        homeScore: status.homeScore,
        awayScore: status.awayScore,
        minute: status.minute,
        matchNumber: globalIndex + 1
      })

      globalIndex += 1
    })
  })

  return matches
}

function buildKnockoutMatches(startNumber) {
  const rounds = [
    { stage: 'Round of 32', short: 'R32', count: 16, dates: ['2026-07-04', '2026-07-05', '2026-07-06', '2026-07-07', '2026-07-08'] },
    { stage: 'Round of 16', short: 'R16', count: 8, dates: ['2026-07-09', '2026-07-10', '2026-07-11', '2026-07-12', '2026-07-13'] },
    { stage: 'Quarter-finals', short: 'QF', count: 4, dates: ['2026-07-14', '2026-07-15'] },
    { stage: 'Semi-finals', short: 'SF', count: 2, dates: ['2026-07-18', '2026-07-19'] },
    { stage: 'Third Place', short: '3P', count: 1, dates: ['2026-07-21'] },
    { stage: 'Final', short: 'F', count: 1, dates: ['2026-07-22'] }
  ]

  const matches = []
  let number = startNumber

  rounds.forEach((round) => {
    for (let index = 0; index < round.count; index += 1) {
      const slot = IST_SLOTS[(number - 1) % IST_SLOTS.length]
      const venue =
        round.short === 'F'
          ? VENUES.find((item) => item.id === 'newyork') || VENUES[0]
          : VENUES[(number + index) % VENUES.length]

      matches.push({
        id: idFromNumber(number),
        group: 'KO',
        stage: round.stage,
        round: round.short,
        date: round.dates[index % round.dates.length],
        ...slot,
        home: 'TBD',
        away: 'TBD',
        venue: venue.name,
        city: venue.city,
        country: venue.country,
        status: 'upcoming',
        homeScore: null,
        awayScore: null,
        minute: null,
        matchNumber: number
      })

      number += 1
    }
  })

  return matches
}

export const MATCHES = [...buildGroupMatches(), ...buildKnockoutMatches(73)]

export const MATCH_MAP = Object.fromEntries(MATCHES.map((match) => [match.id, match]))

export function getMatch(id) {
  return MATCH_MAP[id] || MATCHES[0]
}

export function getMatchesForTeam(code) {
  return MATCHES.filter((match) => match.home === code || match.away === code)
}

export function getWatchModeFromTime(timeIST) {
  const [hour, minute] = timeIST.split(':').map(Number)
  if (hour < 5) return 'LATE_NIGHT'
  if (hour >= 5 && hour < 9) return minute === 30 ? 'EARLY_BIRD' : 'SNACK_MODE'
  if (hour >= 18 && hour < 22) return 'EVENING_PRIME'
  if (hour >= 19 || hour === 22) return 'PRIME_TIME'
  return 'SNACK_MODE'
}
