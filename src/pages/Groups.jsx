import { AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import APIStatusBadge from '../components/features/APIStatusBadge'
import { useWorldCupData } from '../hooks/useWorldCupData'
import { useAppStore } from '../store/useAppStore'

export default function Groups() {
  const navigate = useNavigate()
  const groupTables = useWorldCupData((state) => state.groupTables)
  const searchQuery = useAppStore((state) => state.searchQuery).trim().toLowerCase()

  const groups = groupTables
    .map((group) => ({
      ...group,
      rows: group.rows.filter(
        (row) =>
          !searchQuery ||
          `${row.team.name} ${row.team.fifaCode} group ${group.group}`.toLowerCase().includes(searchQuery)
      )
    }))
    .filter((group) => group.rows.length > 0)

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Updated Groups & Standings</h1>
          <p className="mono-note">
            <AlertTriangle size={15} /> Tables use API group standings when present, otherwise finished group matches are
            computed into P/W/D/L/GD/Pts.
          </p>
        </div>
        <APIStatusBadge />
      </header>

      {groups.length > 0 ? (
        <div className="groups-grid">
          {groups.map((group) => (
            <article className="group-card" key={group.group}>
              <div className="group-card-header">
                <div className="group-card-title">Group {group.group}</div>
                <span className="card-kicker">{group.source}</span>
              </div>
              <table className="standings-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Team</th>
                    <th>P</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GD</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row, index) => (
                    <tr
                      className={`team-row ${row.zone}`}
                      key={row.team.id}
                      onClick={() => navigate(`/team/${row.team.fifaCode || row.team.id}`)}
                    >
                      <td>{index + 1}</td>
                      <td>
                        <span className="team-cell">
                          <span>{row.team.flag}</span>
                          <span>{row.team.name}</span>
                        </span>
                      </td>
                      <td>{row.played}</td>
                      <td>{row.wins}</td>
                      <td>{row.draws}</td>
                      <td>{row.losses}</td>
                      <td>{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                      <td>{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No Group Rows</h2>
          <p>Clear search or refresh the API data to restore the standings board.</p>
        </div>
      )}
    </>
  )
}
