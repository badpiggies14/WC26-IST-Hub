import { Star } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

export default function FavoriteButton({ type = 'match', id, label = 'Favorite' }) {
  const favoriteTeams = useAppStore((state) => state.favoriteTeams)
  const favoriteMatches = useAppStore((state) => state.favoriteMatches)
  const toggleFavoriteTeam = useAppStore((state) => state.toggleFavoriteTeam)
  const toggleFavoriteMatch = useAppStore((state) => state.toggleFavoriteMatch)
  const active = type === 'team' ? favoriteTeams.includes(id) : favoriteMatches.includes(id)

  const handleClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (type === 'team') toggleFavoriteTeam(id)
    else toggleFavoriteMatch(id)
  }

  return (
    <button
      className={`star-btn ${active ? 'active' : ''}`}
      type="button"
      aria-pressed={active}
      aria-label={label}
      title={label}
      onClick={handleClick}
      data-tour="favorite-action"
    >
      <Star fill={active ? 'currentColor' : 'none'} />
    </button>
  )
}
