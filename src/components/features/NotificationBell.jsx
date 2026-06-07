import { Bell } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'
import { useAppStore } from '../../store/useAppStore'

export default function NotificationBell({ match, compact = false }) {
  const { requestPermission, scheduleNotification } = useNotifications()
  const alarms = useAppStore((state) => state.notificationAlarms)
  const setMatchAlarm = useAppStore((state) => state.setMatchAlarm)
  const enabled = match ? Boolean(alarms[match.id]?.['15min']) : Object.keys(alarms).length > 0

  const handleClick = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (!match) return

    const granted = await requestPermission()
    setMatchAlarm(match.id, '15min')
    if (granted) scheduleNotification(match, 15)
  }

  return (
    <button
      className={compact ? `star-btn ${enabled ? 'active' : ''}` : 'icon-btn'}
      type="button"
      aria-label={match ? 'Set match alarm' : 'Notifications'}
      title={match ? 'Set match alarm' : 'Notifications'}
      onClick={handleClick}
    >
      <Bell />
      {enabled && !compact ? <span className="notification-dot" /> : null}
    </button>
  )
}
