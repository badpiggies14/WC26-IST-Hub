export function formatDateTitle(dateString) {
  return new Date(`${dateString}T00:00:00+05:30`).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'long'
  })
}

export function formatDayHeading(dateString) {
  return new Date(`${dateString}T00:00:00+05:30`)
    .toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'long'
    })
    .toUpperCase()
}

export function addDays(dateString, amount) {
  const date = new Date(`${dateString}T00:00:00+05:30`)
  date.setDate(date.getDate() + amount)
  return date.toISOString().slice(0, 10)
}

export function istDateTime(match) {
  return new Date(`${match.date}T${match.timeIST}:00+05:30`)
}

export function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function buildIcs(match) {
  const start = istDateTime(match)
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
  const format = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FIFA 2026 HUB//IST Match Calendar//EN',
    'BEGIN:VEVENT',
    `UID:${match.id}@fifa-2026-hub`,
    `DTSTAMP:${format(new Date())}`,
    `DTSTART:${format(start)}`,
    `DTEND:${format(end)}`,
    `SUMMARY:${match.home} vs ${match.away} - FIFA 2026`,
    `LOCATION:${match.venue}, ${match.city}`,
    `DESCRIPTION:Kickoff ${match.timeIST} IST. Watch mode ${match.watchMode}.`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
}

export function downloadIcs(match) {
  downloadBlob(`${match.id}-${match.home}-vs-${match.away}.ics`, buildIcs(match), 'text/calendar')
}

export function buildCsv(matches) {
  const rows = [
    ['Match', 'Stage', 'Group', 'Date', 'Time IST', 'Home', 'Away', 'Venue', 'City', 'Watch Mode'],
    ...matches.map((match) => [
      match.id,
      match.stage,
      match.group,
      match.date,
      match.timeIST,
      match.home,
      match.away,
      match.venue,
      match.city,
      match.watchMode
    ])
  ]

  return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
}

export function buildSimplePdf(matches) {
  const lines = ['FIFA 2026 HUB - IST Schedule', '', ...matches.slice(0, 45).map((match) => `${match.id}  ${match.date} ${match.timeIST} IST  ${match.home} vs ${match.away}  ${match.venue}`)]
  const content = lines.join('\\n')
  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj',
    '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Courier >> endobj'
  ]
  const stream = `BT /F1 8 Tf 36 750 Td (${content.replace(/[()]/g, '')}) Tj ET`
  objects.push(`5 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`)
  let offset = '%PDF-1.4\n'.length
  const body = objects
    .map((object) => {
      const current = `${object}\n`
      offset += current.length
      return current
    })
    .join('')
  const xrefStart = '%PDF-1.4\n'.length + body.length
  return `%PDF-1.4\n${body}xref\n0 6\n0000000000 65535 f \ntrailer << /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`
}
