import { WATCH_MODE_LABELS } from '../../data/matches'

const classMap = {
  LATE_NIGHT: 'late-night',
  SNACK_MODE: 'snack-mode',
  EARLY_BIRD: 'early-bird',
  EVENING_PRIME: 'evening-prime',
  PRIME_TIME: 'prime-time'
}

export default function ISTBadge({ mode }) {
  return <span className={`watch-badge ${classMap[mode] || 'snack-mode'}`}>{WATCH_MODE_LABELS[mode] || mode}</span>
}
