import { useEffect, useMemo, useState } from 'react'
import { Trophy } from 'lucide-react'
import { useWorldCupData } from '../../hooks/useWorldCupData'

const MINIMUM_INTRO_MS = 1400

export default function DesktopLoadingScreen() {
  const isLoading = useWorldCupData((state) => state.isLoading)
  const apiStatus = useWorldCupData((state) => state.apiStatus)
  const [introDone, setIntroDone] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroDone(true), MINIMUM_INTRO_MS)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined

    const media = window.matchMedia('(min-width: 768px)')
    const updateDesktopState = () => setIsDesktop(media.matches)
    updateDesktopState()

    media.addEventListener('change', updateDesktopState)
    return () => media.removeEventListener('change', updateDesktopState)
  }, [])

  const statusText = useMemo(() => {
    if (apiStatus === 'live') return 'Live fixtures synced'
    if (apiStatus === 'cached') return 'Loading cached match hub'
    if (apiStatus === 'auth') return 'API auth needed, fallback ready'
    if (apiStatus === 'offline') return 'Offline mode ready'
    if (apiStatus === 'error') return 'Fallback schedule ready'
    return 'Syncing fixtures in IST'
  }, [apiStatus])

  const visible = isDesktop && !dismissed && (isLoading || !introDone)

  if (!visible) return null

  return (
    <div className="desktop-loading-screen" role="status" aria-live="polite">
      <div className="loading-stadium-card">
        <div className="loading-trophy-mark" aria-hidden="true">
          <Trophy />
          <span className="loading-ball" />
        </div>
        <div>
          <p className="loading-kicker">WC26 IST Hub</p>
          <h2>Preparing Matchday</h2>
          <p>{statusText}</p>
        </div>
        <div className="loading-progress" aria-hidden="true">
          <span />
        </div>
        <button className="loading-skip" type="button" onClick={() => setDismissed(true)}>
          Enter Hub
        </button>
      </div>
    </div>
  )
}
