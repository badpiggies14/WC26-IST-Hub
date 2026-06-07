import { useState } from 'react'
import { getTeam } from '../../data/teams'
import { getFlagEmoji, getFlagSources, getTeamInitials } from '../../lib/flags'

export default function TeamFlag({ code, team: providedTeam, size = 'small', title, fallbackLabel = 'TBD' }) {
  const [sourceIndex, setSourceIndex] = useState(0)
  const team = providedTeam || getTeam(code)
  const sources = getFlagSources(team)
  const emoji = getFlagEmoji(team)
  const initials = getTeamInitials(team, fallbackLabel)
  const imageSrc = sources[sourceIndex]

  return (
    <span className={`team-flag ${size}`} role="img" aria-label={title || team.fullName || team.name || fallbackLabel}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          loading="lazy"
          onError={() => setSourceIndex((index) => index + 1)}
        />
      ) : emoji ? (
        <span>{emoji}</span>
      ) : (
        <span className="flag-initials">{initials}</span>
      )}
    </span>
  )
}
