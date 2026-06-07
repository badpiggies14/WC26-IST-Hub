import { Lock, Plus } from 'lucide-react'
import MatchCard from '../components/ui/MatchCard'
import TeamFlag from '../components/ui/TeamFlag'
import { useWorldCupData } from '../hooks/useWorldCupData'
import { useAppStore } from '../store/useAppStore'

export default function Favorites() {
  const teams = useWorldCupData((state) => state.teams)
  const matches = useWorldCupData((state) => state.matches)
  const favoriteTeams = useAppStore((state) => state.favoriteTeams)
  const favoriteMatches = useAppStore((state) => state.favoriteMatches)
  const toggleFavoriteTeam = useAppStore((state) => state.toggleFavoriteTeam)
  const toggleFavoriteMatch = useAppStore((state) => state.toggleFavoriteMatch)

  const selectedTeams = teams.filter((team) => favoriteTeams.includes(team.id) || favoriteTeams.includes(team.fifaCode))
  const favoriteTeamMatches = matches
    .filter(
      (match) =>
        favoriteMatches.includes(match.id) ||
        [match.homeTeam?.id, match.homeTeam?.fifaCode, match.awayTeam?.id, match.awayTeam?.fifaCode]
          .filter(Boolean)
          .some((value) => favoriteTeams.includes(value))
    )
    .slice(0, 12)

  const addNextTeam = () => {
    const next = teams.find((team) => !favoriteTeams.includes(team.id) && !favoriteTeams.includes(team.fifaCode))
    if (next && favoriteTeams.length < 5) toggleFavoriteTeam(next.fifaCode || next.id)
  }

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Your Favorites</h1>
          <p className="page-subtitle">Favorite matches and teams persist locally and highlight all related fixtures.</p>
        </div>
      </header>

      {selectedTeams.length > 0 ? (
        <>
          <div className="favorites-row" aria-label="Favorite teams">
            {selectedTeams.map((team) => (
              <button
                className="favorite-team-card"
                key={team.id}
                type="button"
                onClick={() => toggleFavoriteTeam(team.fifaCode || team.id)}
                aria-label={`Remove ${team.name}`}
              >
                <TeamFlag team={team} size="medium" />
                <strong>{team.name}</strong>
                <span className="brand-subtitle">Tap to remove</span>
              </button>
            ))}
            <button className="favorite-team-card add-team-card" type="button" onClick={addNextTeam}>
              {favoriteTeams.length >= 5 ? <Lock /> : <Plus />}
              <strong>{favoriteTeams.length >= 5 ? 'Locked' : 'Add Team'}</strong>
              <span className="brand-subtitle">Max 5 Teams</span>
            </button>
          </div>

          <div className="section-row">
            <h2 className="section-title">Favorite Fixtures</h2>
            <button className="text-link" type="button" onClick={() => favoriteMatches.forEach(toggleFavoriteMatch)}>
              Clear Saved
            </button>
          </div>

          {favoriteTeamMatches.length > 0 ? (
            <div className="featured-grid">
              {favoriteTeamMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No Favorite Fixtures</h2>
              <p>Your saved teams do not have matching fixtures yet.</p>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <h2>No Favorites Yet</h2>
          <p>No favorites yet. Pick your teams to track them here.</p>
          <button className="btn btn-primary" type="button" onClick={addNextTeam}>
            Explore Teams
          </button>
        </div>
      )}
    </>
  )
}
