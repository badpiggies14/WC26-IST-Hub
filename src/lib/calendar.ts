import type { Match } from '../types/worldcup'
import { formatMatchDateIST, formatMatchTimeIST, getVenueLocalTime } from './time'

function eventTitle(match: Match) {
  return `World Cup 2026: ${match.homeLabel || match.homeTeam?.name || 'TBD'} vs ${match.awayLabel || match.awayTeam?.name || 'TBD'}`
}

function eventDescription(match: Match) {
  const venue = match.venue
  return [
    `Kickoff in IST: ${formatMatchDateIST(match.dateUTC)} at ${formatMatchTimeIST(match.dateUTC)}`,
    venue ? `Venue: ${venue.name}, ${venue.city}` : 'Venue: TBD',
    `Round: ${match.roundLabel}`,
    `API source: worldcup26.ir`
  ].join('\n')
}

function googleDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

export function getGoogleCalendarUrl(match: Match) {
  const start = new Date(match.dateUTC)
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle(match),
    details: eventDescription(match),
    dates: `${googleDate(start)}/${googleDate(end)}`,
    location: match.venue ? `${match.venue.name}, ${match.venue.city}, ${match.venue.country}` : 'TBD'
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function buildIcs(match: Match) {
  const start = new Date(match.dateUTC)
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FIFA 2026 HUB//WorldCup26 API//EN',
    'BEGIN:VEVENT',
    `UID:wc2026-${match.id}@fifa-2026-hub`,
    `DTSTAMP:${googleDate(new Date())}`,
    `DTSTART:${googleDate(start)}`,
    `DTEND:${googleDate(end)}`,
    `SUMMARY:${eventTitle(match)}`,
    `LOCATION:${match.venue ? `${match.venue.name}, ${match.venue.city}` : 'TBD'}`,
    `DESCRIPTION:${eventDescription(match).replace(/\n/g, '\\n')}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
}

export function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadMatchIcs(match: Match) {
  downloadTextFile(`wc2026-${match.id}.ics`, buildIcs(match), 'text/calendar')
}

export function buildMatchDetails(match: Match) {
  const venueTime = match.venue ? getVenueLocalTime(match.dateUTC, match.venue.timezone) : 'Venue local time TBD'
  return `${eventTitle(match)}\nIST: ${formatMatchDateIST(match.dateUTC)} ${formatMatchTimeIST(match.dateUTC)}\nVenue local: ${venueTime}\n${match.venue ? `${match.venue.name}, ${match.venue.city}` : 'Venue TBD'}`
}

export function buildScheduleCsv(matches: Match[]) {
  const rows = [
    ['Match', 'Round', 'Date IST', 'Time IST', 'Home', 'Away', 'Venue', 'City', 'Status'],
    ...matches.map((match) => [
      match.matchNumber,
      match.roundLabel,
      formatMatchDateIST(match.dateUTC),
      formatMatchTimeIST(match.dateUTC),
      match.homeLabel || match.homeTeam?.name || 'TBD',
      match.awayLabel || match.awayTeam?.name || 'TBD',
      match.venue?.name || 'TBD',
      match.venue?.city || 'TBD',
      match.status
    ])
  ]

  return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
}

function escapePdfText(text: string) {
  return text.replace(/[\\()]/g, (char) => `\\${char}`)
}

export function buildSchedulePdf(matches: Match[]) {
  const lines = [
    'FIFA 2026 HUB - IST Schedule',
    'Source: worldcup26.ir',
    '',
    ...matches.slice(0, 52).map((match) =>
      `${match.matchNumber}. ${formatMatchDateIST(match.dateUTC)} ${formatMatchTimeIST(match.dateUTC)} - ${
        match.homeLabel || match.homeTeam?.name || 'TBD'
      } vs ${match.awayLabel || match.awayTeam?.name || 'TBD'}`
    )
  ]
  const stream = `BT /F1 9 Tf ${lines
    .map((line, index) => `1 0 0 1 36 ${760 - index * 13} Tm (${escapePdfText(line)}) Tj`)
    .join('\n')} ET`
  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj\n',
    '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Courier >> endobj\n',
    `5 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj\n`
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  objects.forEach((object) => {
    offsets.push(pdf.length)
    pdf += object
  })
  const xrefStart = pdf.length
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, '0')} 00000 n `)
    .join('\n')}\ntrailer << /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`
  return pdf
}
