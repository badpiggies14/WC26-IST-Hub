import type { Match } from '../types/worldcup'
import { getWatchMeter } from './time'
import { CACHE_KEYS, readStorage, writeStorage } from './storage'

export type ReminderOffset = 5 | 15 | 30 | 60

export type MatchReminder = {
  id: string
  matchId: string
  minutesBefore: ReminderOffset
  createdAt: number
}

export function getReminderCta(match: Match) {
  return getWatchMeter(match.dateUTC).snackMode ? 'Set Chai Alarm' : 'Set Alarm'
}

export function getReminders(): MatchReminder[] {
  return readStorage<MatchReminder[]>(CACHE_KEYS.reminders, [])
}

export function saveReminder(match: Match, minutesBefore: ReminderOffset) {
  const reminders = getReminders().filter(
    (reminder) => !(reminder.matchId === match.id && reminder.minutesBefore === minutesBefore)
  )
  const next = [
    ...reminders,
    {
      id: `${match.id}-${minutesBefore}`,
      matchId: match.id,
      minutesBefore,
      createdAt: Date.now()
    }
  ]
  writeStorage(CACHE_KEYS.reminders, next)
  return next
}

export function removeReminder(matchId: string, minutesBefore?: ReminderOffset) {
  const next = getReminders().filter(
    (reminder) => reminder.matchId !== matchId || (minutesBefore ? reminder.minutesBefore !== minutesBefore : false)
  )
  writeStorage(CACHE_KEYS.reminders, next)
  return next
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  return Notification.requestPermission()
}

export async function scheduleBrowserNotification(match: Match, minutesBefore: ReminderOffset) {
  const permission = await requestNotificationPermission()
  saveReminder(match, minutesBefore)

  if (permission !== 'granted') return { scheduled: false, reason: permission }

  const notifyAt = new Date(match.dateUTC).getTime() - minutesBefore * 60 * 1000
  const delay = notifyAt - Date.now()
  const maxDelay = 2_147_483_647

  if (delay > 0 && delay < maxDelay) {
    window.setTimeout(() => {
      new Notification('World Cup match starting soon', {
        body: `${match.homeLabel} vs ${match.awayLabel} starts in ${minutesBefore} min - IST kickoff.`,
        icon: '/brand/wc26-ist-hub-mark.png'
      })
    }, delay)
  }

  return { scheduled: delay > 0, reason: delay <= 0 ? 'past' : undefined }
}
