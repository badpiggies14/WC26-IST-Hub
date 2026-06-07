export function useNotifications() {
  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  const scheduleNotification = (match, minutesBefore = 15) => {
    if (!('Notification' in window)) return false

    const matchTime = new Date(`${match.date}T${match.timeIST}:00+05:30`)
    const notifyTime = new Date(matchTime.getTime() - minutesBefore * 60000)
    const delay = notifyTime.getTime() - Date.now()

    if (delay > 0) {
      window.setTimeout(() => {
        new Notification('Match Starting Soon!', {
          body: `${match.home} vs ${match.away} starts in ${minutesBefore} minutes - ${match.timeIST} IST`,
          icon: '/brand/wc26-ist-hub-mark.png'
        })
      }, delay)
      return true
    }

    return false
  }

  return { requestPermission, scheduleNotification }
}
