import { Bell } from 'lucide-react'
import { useState } from 'react'
import { getReminderCta, scheduleBrowserNotification } from '../../lib/notifications'

const options = [
  { value: 5, label: '5 min' },
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '1 hour' }
]

export default function ReminderButton({ match, compact = false }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const setReminder = async (minutes) => {
    const result = await scheduleBrowserNotification(match, minutes)
    setMessage(result.scheduled ? `Reminder set ${minutes} min before.` : 'Reminder saved. Browser notification unavailable.')
    setOpen(false)
  }

  if (compact) {
    return (
      <button className="star-btn" type="button" aria-label={getReminderCta(match)} data-tour="reminder-action" onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        setReminder(15)
      }}>
        <Bell />
      </button>
    )
  }

  return (
    <div className="reminder-control" data-tour="reminder-action">
      <button className="btn btn-primary" type="button" onClick={() => setOpen((value) => !value)}>
        <Bell /> {getReminderCta(match)}
      </button>
      {open ? (
        <div className="reminder-options">
          {options.map((option) => (
            <button key={option.value} type="button" onClick={() => setReminder(option.value)}>
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
      {message ? <small className="status-message">{message}</small> : null}
    </div>
  )
}
