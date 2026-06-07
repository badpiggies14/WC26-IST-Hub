const rounds = [
  ['r32', 'Round of 32', 'r32'],
  ['r16', 'Round of 16', 'r16'],
  ['qf', 'Quarter-finals', 'qf'],
  ['sf', 'Semi-finals', 'sf'],
  ['third', 'Third Place', 'sf'],
  ['final', 'Final', 'final']
]

export default function BracketTree({ matches = [] }) {
  const roundConfig = rounds.map(([stage, title, className]) => ({
    stage,
    title,
    className,
    matches: matches.filter((match) => match.stage === stage)
  }))

  return (
    <div className="bracket-scroll">
      <div className="bracket-tree" role="list" aria-label="Knockout bracket">
        {roundConfig.map((round) => (
          <div className={`bracket-column ${round.className}`} key={round.stage}>
            <h2 className="bracket-round-title">{round.title}</h2>
            {round.matches.map((match, index) => (
              <div className={`bracket-match ${match.stage === 'final' ? 'final-card' : ''}`} key={match.id} role="listitem">
                <div className="bracket-fixture">
                  {match.homeTeam?.fifaCode || match.homeLabel || 'TBD'} <span style={{ color: 'var(--text-secondary)' }}>vs</span>{' '}
                  {match.awayTeam?.fifaCode || match.awayLabel || 'TBD'}
                </div>
                <div className="bracket-meta">Match #{match.matchNumber}</div>
                <div className="bracket-meta">{match.status === 'finished' ? 'Completed' : match.roundLabel}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
