import { useEffect } from 'react'
import { CACHE_KEYS, readStorage, writeStorage } from '../../lib/storage'
import { useAppStore } from '../../store/useAppStore'

export const TIME_DISPLAY_OPTIONS = [
  { id: 'ist', label: 'IST' },
  { id: 'venue', label: 'Venue Local' },
  { id: 'my', label: 'My Time' },
  { id: 'utc', label: 'UTC' },
  { id: 'compare', label: 'Compare' }
] as const

type TimeDisplayMode = (typeof TIME_DISPLAY_OPTIONS)[number]['id']

type TimeDisplayModeToggleProps = {
  compact?: boolean
}

function isTimeDisplayMode(value: string): value is TimeDisplayMode {
  return TIME_DISPLAY_OPTIONS.some((option) => option.id === value)
}

export default function TimeDisplayModeToggle({ compact = false }: TimeDisplayModeToggleProps) {
  const mode = useAppStore((state) => state.timeDisplayMode || 'ist')
  const setTimeDisplayMode = useAppStore((state) => state.setTimeDisplayMode)

  useEffect(() => {
    const stored = readStorage<string>(CACHE_KEYS.timeDisplayMode, mode)
    if (isTimeDisplayMode(stored) && stored !== mode) setTimeDisplayMode(stored)
  }, [mode, setTimeDisplayMode])

  const updateMode = (value: TimeDisplayMode) => {
    setTimeDisplayMode(value)
    writeStorage(CACHE_KEYS.timeDisplayMode, value)
  }

  return (
    <div className={`time-mode-control ${compact ? 'compact' : ''}`} data-tour="timezone-selector">
      <span>Time Display</span>
      <div className="time-mode-options" role="radiogroup" aria-label="Time display mode">
        {TIME_DISPLAY_OPTIONS.map((option) => (
          <button
            key={option.id}
            className={mode === option.id ? 'active' : ''}
            type="button"
            role="radio"
            aria-checked={mode === option.id}
            onClick={() => updateMode(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
