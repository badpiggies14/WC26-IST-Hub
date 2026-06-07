import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ROLLING_FOOTBALL_EVENT, ROLLING_FOOTBALL_STORAGE_KEY } from '../effects/RollingFootball'
import { LEGEND_FUN_EVENT, LEGEND_FUN_STORAGE_KEY } from '../fun/LegendFlagSurprise'
import TimeDisplayModeToggle from '../time/TimeDisplayModeToggle'
import { CACHE_KEYS, readStorage, writeStorage } from '../../lib/storage'
import { useAppStore } from '../../store/useAppStore'

type FirstTimeSetupProps = {
  isOpen: boolean
  onComplete: () => void
  onSkip: () => void
}

const quickTeams = [
  { code: 'ARG', label: 'Argentina' },
  { code: 'POR', label: 'Portugal' },
  { code: 'BRA', label: 'Brazil' },
  { code: 'MEX', label: 'Host Mexico' },
  { code: 'USA', label: 'Host USA' }
]

function readBoolean(key: string, fallback = true) {
  return readStorage<boolean>(key, fallback)
}

export default function FirstTimeSetup({ isOpen, onComplete, onSkip }: FirstTimeSetupProps) {
  const [step, setStep] = useState(0)
  const [reminderPreference, setReminderPreference] = useState(() => readStorage('wc2026_reminder_preference', 'favorites'))
  const [rollingEnabled, setRollingEnabled] = useState(() => readBoolean(ROLLING_FOOTBALL_STORAGE_KEY, true))
  const [legendEnabled, setLegendEnabled] = useState(() => readBoolean(LEGEND_FUN_STORAGE_KEY, true))
  const [introEnabled, setIntroEnabled] = useState(() => readBoolean(CACHE_KEYS.introAnimationsEnabled, true))
  const favoriteTeams = useAppStore((state) => state.favoriteTeams)
  const toggleFavoriteTeam = useAppStore((state) => state.toggleFavoriteTeam)

  const steps = useMemo(
    () => [
      {
        title: 'Pick favorite teams',
        body: 'Choose up to five teams for faster tracking and reminders.'
      },
      {
        title: 'Choose time display',
        body: 'IST stays big. Add supporting timezone context when you want it.'
      },
      {
        title: 'Match reminders',
        body: 'Decide how proactive the hub should be about alerts.'
      },
      {
        title: 'Fun effects',
        body: 'Keep the polished football extras you enjoy.'
      }
    ],
    []
  )

  const finish = () => {
    writeStorage('wc2026_reminder_preference', reminderPreference)
    writeStorage(ROLLING_FOOTBALL_STORAGE_KEY, rollingEnabled)
    writeStorage(LEGEND_FUN_STORAGE_KEY, legendEnabled)
    writeStorage(CACHE_KEYS.introAnimationsEnabled, introEnabled)
    window.dispatchEvent(new Event(ROLLING_FOOTBALL_EVENT))
    window.dispatchEvent(new Event(LEGEND_FUN_EVENT))
    onComplete()
  }

  const next = () => {
    if (step >= steps.length - 1) finish()
    else setStep((value) => value + 1)
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div className="setup-overlay" role="dialog" aria-modal="true" aria-labelledby="setup-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section className="setup-card" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 18, opacity: 0 }}>
            <button className="setup-close" type="button" onClick={onSkip} aria-label="Skip first-time setup">
              <X size={18} />
            </button>
            <span className="card-kicker">Quick Setup • {step + 1} of {steps.length}</span>
            <h2 id="setup-title">{steps[step].title}</h2>
            <p>{steps[step].body}</p>

            {step === 0 ? (
              <div className="setup-chip-grid">
                {quickTeams.map((team) => {
                  const active = favoriteTeams.includes(team.code)
                  return (
                    <button key={team.code} className={active ? 'active' : ''} type="button" onClick={() => toggleFavoriteTeam(team.code)}>
                      {active ? <Check size={14} /> : null}
                      {team.label}
                    </button>
                  )
                })}
                <button type="button" onClick={next}>Skip teams</button>
              </div>
            ) : null}

            {step === 1 ? <TimeDisplayModeToggle compact /> : null}

            {step === 2 ? (
              <div className="setup-options" role="radiogroup" aria-label="Reminder preference">
                {[
                  ['off', 'Off'],
                  ['favorites', 'Favorite teams only'],
                  ['big', 'Big matches'],
                  ['manual', 'All reminders manually']
                ].map(([value, label]) => (
                  <button key={value} className={reminderPreference === value ? 'active' : ''} type="button" onClick={() => setReminderPreference(value)}>
                    {label}
                  </button>
                ))}
              </div>
            ) : null}

            {step === 3 ? (
              <div className="setup-toggles">
                {[
                  ['Rolling football', rollingEnabled, setRollingEnabled],
                  ['Legend Flag Surprise', legendEnabled, setLegendEnabled],
                  ['Intro animations', introEnabled, setIntroEnabled]
                ].map(([label, enabled, setter]) => (
                  <button key={label as string} className={enabled ? 'active' : ''} type="button" onClick={() => (setter as (value: boolean) => void)(!(enabled as boolean))}>
                    <Sparkles size={16} /> {label as string}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="setup-progress" aria-hidden="true">
              {steps.map((item, index) => (
                <span key={item.title} className={index <= step ? 'active' : ''} />
              ))}
            </div>

            <div className="setup-actions">
              <button className="btn btn-ghost" type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}>
                <ChevronLeft /> Back
              </button>
              <button className="btn btn-primary" type="button" onClick={next}>
                {step === steps.length - 1 ? 'Finish Setup' : 'Next'} <ChevronRight />
              </button>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
