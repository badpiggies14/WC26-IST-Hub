import BracketTree from '../components/features/BracketTree'
import StadiumBackground from '../components/features/StadiumBackground'
import APIStatusBadge from '../components/features/APIStatusBadge'
import { useWorldCupData } from '../hooks/useWorldCupData'

export default function Knockouts() {
  const matches = useWorldCupData((state) => state.matches)
  const knockoutMatches = matches.filter((match) => match.stage !== 'group')

  return (
    <>
      <StadiumBackground className="glass-card" style={{ padding: 24 }}>
        <div className="split-row">
          <div>
            <h1 className="page-title">Complete Knockout Bracket Tree</h1>
            <p className="page-subtitle">Round of 32 through the final, with TBD labels from the API until teams qualify.</p>
          </div>
          <APIStatusBadge />
        </div>
      </StadiumBackground>
      <BracketTree matches={knockoutMatches} />
    </>
  )
}
