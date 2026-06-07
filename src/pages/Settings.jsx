import { useEffect, useState } from 'react'
import { Bell, Check, Coffee, Download, Palette, ShieldCheck, Sparkles, Trophy, Zap } from 'lucide-react'
import { ROLLING_FOOTBALL_EVENT, ROLLING_FOOTBALL_STORAGE_KEY } from '../components/effects/RollingFootball'
import APIStatusBadge from '../components/features/APIStatusBadge'
import { LEGEND_FUN_EVENT, LEGEND_FUN_STORAGE_KEY } from '../components/fun/LegendFlagSurprise'
import TimeDisplayModeToggle from '../components/time/TimeDisplayModeToggle'
import { REPLAY_INTRO_EVENT, RESET_SETUP_EVENT } from '../hooks/useFirstVisit'
import { REPLAY_TUTORIAL_EVENT } from '../hooks/useProductTour'
import { buildScheduleCsv, buildSchedulePdf, downloadTextFile } from '../lib/calendar'
import { readStorage, writeStorage } from '../lib/storage'
import { useWorldCupData } from '../hooks/useWorldCupData'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useAppStore } from '../store/useAppStore'

const themeOptions = [
  {
    id: 'stadium',
    label: 'Stadium Night',
    description: 'Classic floodlights, deep navy glass, gold match focus.',
    icon: Trophy
  },
  {
    id: 'trophy',
    label: 'Trophy Gold',
    description: 'Warmer champion glow for finals, big nights, and premium cards.',
    icon: Sparkles
  },
  {
    id: 'pitch',
    label: 'Electric Pitch',
    description: 'Sharper blue-green pitch energy for schedule browsing.',
    icon: Zap
  },
  {
    id: 'chai',
    label: 'Midnight Chai',
    description: 'Late-night Indian watch mode with soft amber contrast.',
    icon: Coffee
  }
]

function ToggleRow({ title, body, enabled, onClick }) {
  return (
    <div className="settings-row">
      <div>
        <strong>{title}</strong>
        <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>{body}</p>
      </div>
      <button className={`toggle ${enabled ? 'on' : ''}`} type="button" aria-pressed={enabled} onClick={onClick} />
    </div>
  )
}

function readRollingBallSetting(prefersReducedMotion) {
  if (typeof window === 'undefined') return !prefersReducedMotion

  try {
    const stored = window.localStorage.getItem(ROLLING_FOOTBALL_STORAGE_KEY)
    return stored === null ? !prefersReducedMotion : stored === 'true'
  } catch {
    return !prefersReducedMotion
  }
}

function writeRollingBallSetting(enabled) {
  try {
    window.localStorage.setItem(ROLLING_FOOTBALL_STORAGE_KEY, String(enabled))
  } catch {
    // Settings should still feel responsive if storage is unavailable.
  }

  window.dispatchEvent(new Event(ROLLING_FOOTBALL_EVENT))
}

function writeLegendFunSetting(enabled) {
  writeStorage(LEGEND_FUN_STORAGE_KEY, enabled)
  window.dispatchEvent(new Event(LEGEND_FUN_EVENT))
}

function SegmentedToggleRow({ title, body, enabled, onChange }) {
  return (
    <div className="settings-row">
      <div>
        <strong>{title}</strong>
        <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>{body}</p>
      </div>
      <div className="segmented-toggle" role="group" aria-label={title}>
        <button className={enabled ? 'active' : ''} type="button" aria-pressed={enabled} onClick={() => onChange(true)}>
          On
        </button>
        <button className={!enabled ? 'active' : ''} type="button" aria-pressed={!enabled} onClick={() => onChange(false)}>
          Off
        </button>
      </div>
    </div>
  )
}

export default function Settings() {
  const matches = useWorldCupData((state) => state.matches)
  const prefersReducedMotion = usePrefersReducedMotion()
  const notificationsEnabled = useAppStore((state) => state.notificationsEnabled)
  const goalAlertsEnabled = useAppStore((state) => state.goalAlertsEnabled)
  const toggleNotificationsEnabled = useAppStore((state) => state.toggleNotificationsEnabled)
  const toggleGoalAlertsEnabled = useAppStore((state) => state.toggleGoalAlertsEnabled)
  const appTheme = useAppStore((state) => state.appTheme)
  const setAppTheme = useAppStore((state) => state.setAppTheme)
  const [rollingBallEnabled, setRollingBallEnabled] = useState(() => readRollingBallSetting(false))
  const [legendFunEnabled, setLegendFunEnabled] = useState(() => readStorage(LEGEND_FUN_STORAGE_KEY, true))

  useEffect(() => {
    setRollingBallEnabled(readRollingBallSetting(prefersReducedMotion))
  }, [prefersReducedMotion])

  const updateRollingBall = (enabled) => {
    setRollingBallEnabled(enabled)
    writeRollingBallSetting(enabled)
  }

  const updateLegendFun = (enabled) => {
    setLegendFunEnabled(enabled)
    writeLegendFunSetting(enabled)
  }

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Settings & Preferences</h1>
          <p className="page-subtitle">Customize your tournament experience and notification alerts.</p>
        </div>
        <APIStatusBadge />
      </header>

      <div className="settings-stack">
        <section className="panel-card experience-panel">
          <h3>
            <Sparkles size={20} /> Experience
          </h3>
          <div className="settings-row">
            <div>
              <strong>Replay Intro</strong>
              <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
                Run the stadium-entry animation again.
              </p>
            </div>
            <button className="btn btn-ghost" type="button" onClick={() => window.dispatchEvent(new Event(REPLAY_INTRO_EVENT))}>
              Replay
            </button>
          </div>
          <div className="settings-row">
            <div>
              <strong>Replay Tutorial</strong>
              <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
                Restart the guided tour with spotlight hints.
              </p>
            </div>
            <button className="btn btn-ghost" type="button" onClick={() => window.dispatchEvent(new Event(REPLAY_TUTORIAL_EVENT))}>
              Start Tour
            </button>
          </div>
          <div className="settings-row">
            <div>
              <strong>Reset First-Time Setup</strong>
              <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
                Open the favorite teams, time display, reminders, and effects setup again.
              </p>
            </div>
            <button className="btn btn-ghost" type="button" onClick={() => window.dispatchEvent(new Event(RESET_SETUP_EVENT))}>
              Reset
            </button>
          </div>
          <SegmentedToggleRow
            title="Rolling Football Scroll Effect"
            body="Show the subtle pitch-track football that rolls with page scroll on desktop and mobile."
            enabled={rollingBallEnabled}
            onChange={updateRollingBall}
          />
          <SegmentedToggleRow
            title="Legend Flag Surprise"
            body="Show the playful legend flag widget on desktop."
            enabled={legendFunEnabled}
            onChange={updateLegendFun}
          />
          <div className="settings-row">
            <div>
              <strong>Time Display Mode</strong>
              <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
                IST always stays the hero time; other zones appear as supporting context.
              </p>
            </div>
            <TimeDisplayModeToggle compact />
          </div>
          {prefersReducedMotion ? (
            <div className="info-card">
              <p>Reduced motion is enabled in your system, so intro and tutorial motion will be simplified.</p>
            </div>
          ) : null}
        </section>

        <section className="panel-card">
          <h3>
            <Bell size={20} /> Match Alerts
          </h3>
          <ToggleRow
            title="Kickoff Notifications"
            body="Get alerted 15 min before your favorite matches start."
            enabled={notificationsEnabled}
            onClick={toggleNotificationsEnabled}
          />
          <ToggleRow
            title="Goal Updates"
            body="Instant alerts when a goal is scored in followed games."
            enabled={goalAlertsEnabled}
            onClick={toggleGoalAlertsEnabled}
          />
        </section>

        <section className="panel-card">
          <h3>Time & Display</h3>
          <div className="info-card">
            <p>
              <ShieldCheck size={18} /> IST First - Match cards keep Indian Standard Time as the biggest time, with
              venue, browser local, and UTC context available when selected.
            </p>
          </div>
        </section>

        <section className="panel-card brand-theme-card">
          <div className="brand-theme-hero">
            <div>
              <h3>
                <Palette size={20} /> App Theme Studio
              </h3>
              <p>Choose a premium football mood for the hub. Every theme keeps IST-first readability intact.</p>
            </div>
            <img src="/brand/wc26-ist-hub-lockup.png" alt="WC26 IST Hub logo" />
          </div>
          <div className="theme-grid" role="radiogroup" aria-label="App theme">
            {themeOptions.map((theme) => {
              const Icon = theme.icon
              const active = appTheme === theme.id

              return (
                <button
                  key={theme.id}
                  className={`theme-card theme-card--${theme.id} ${active ? 'active' : ''}`}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setAppTheme(theme.id)}
                >
                  <span className="theme-card-top">
                    <span className="theme-icon">
                      <Icon size={18} />
                    </span>
                    {active ? <Check size={18} /> : null}
                  </span>
                  <strong>{theme.label}</strong>
                  <small>{theme.description}</small>
                  <span className="theme-swatch-row" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="panel-card">
          <h3>Schedule Utilities</h3>
          <div className="settings-row">
            <div>
              <strong>Download Schedule</strong>
              <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
                Export the full 104-match IST schedule for offline planning.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => downloadTextFile('fifa-2026-ist-schedule.csv', buildScheduleCsv(matches), 'text/csv')}
              >
                <Download /> CSV
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => downloadTextFile('fifa-2026-ist-schedule.pdf', buildSchedulePdf(matches), 'application/pdf')}
              >
                <Download /> PDF
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
