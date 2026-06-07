import { Share2 } from 'lucide-react'
import { useState } from 'react'
import { shareMatch } from '../../lib/share'

export default function ShareMatchButton({ match }) {
  const [message, setMessage] = useState('')

  const handleShare = async () => {
    const mode = await shareMatch(match)
    setMessage(mode === 'native' ? 'Share sheet opened.' : 'Match details copied.')
  }

  return (
    <div>
      <button className="btn btn-ghost" type="button" onClick={handleShare}>
        <Share2 /> Share Match
      </button>
      {message ? <small className="status-message">{message}</small> : null}
    </div>
  )
}
