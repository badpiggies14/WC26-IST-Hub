import { CalendarPlus } from 'lucide-react'
import { downloadMatchIcs, getGoogleCalendarUrl } from '../../lib/calendar'

export default function AddToCalendarButton({ match }) {
  return (
    <div className="calendar-actions">
      <button className="btn btn-ghost" type="button" onClick={() => downloadMatchIcs(match)}>
        <CalendarPlus /> .ics
      </button>
      <a className="btn btn-ghost" href={getGoogleCalendarUrl(match)} target="_blank" rel="noreferrer">
        Google
      </a>
    </div>
  )
}
