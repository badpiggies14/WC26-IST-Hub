import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { LEGENDS, type Legend } from '../../data/legends'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { CACHE_KEYS, readStorage } from '../../lib/storage'
import LegendRevealModal from './LegendRevealModal'

type LegendFlagSurpriseProps = {
  className?: string
  compact?: boolean
}

const SEEN_KEY = 'wc2026_legend_fun_seen'
export const LEGEND_FUN_STORAGE_KEY = CACHE_KEYS.legendFunEnabled
export const LEGEND_FUN_EVENT = 'wc2026:legend-fun-setting'

function readSeenFunHint() {
  if (typeof window === 'undefined') return false

  try {
    return window.localStorage.getItem(SEEN_KEY) === 'true'
  } catch {
    return false
  }
}

function writeSeenFunHint() {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(SEEN_KEY, 'true')
  } catch {
    // Optional fun hint persistence should never affect the app.
  }
}

export default function LegendFlagSurprise({ className = '', compact = false }: LegendFlagSurpriseProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [selectedLegend, setSelectedLegend] = useState<Legend | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [hasSeenFunHint, setHasSeenFunHint] = useState(readSeenFunHint)
  const [isMobile, setIsMobile] = useState(false)
  const [enabled, setEnabled] = useState(() => readStorage<boolean>(LEGEND_FUN_STORAGE_KEY, true))

  const idleY = useMemo(() => (hasSeenFunHint ? [0, -1, 0] : [0, -3, 0]), [hasSeenFunHint])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined

    const media = window.matchMedia('(max-width: 767px)')
    const updateMobileState = () => setIsMobile(media.matches)
    updateMobileState()

    media.addEventListener('change', updateMobileState)
    return () => media.removeEventListener('change', updateMobileState)
  }, [])

  useEffect(() => {
    const updateEnabled = () => setEnabled(readStorage<boolean>(LEGEND_FUN_STORAGE_KEY, true))
    updateEnabled()

    window.addEventListener('storage', updateEnabled)
    window.addEventListener(LEGEND_FUN_EVENT, updateEnabled)

    return () => {
      window.removeEventListener('storage', updateEnabled)
      window.removeEventListener(LEGEND_FUN_EVENT, updateEnabled)
    }
  }, [])

  const revealLegend = (legend: Legend) => {
    setSelectedLegend(legend)
    setIsOpen(true)
    if (!hasSeenFunHint) {
      setHasSeenFunHint(true)
      writeSeenFunHint()
    }
  }

  if (isMobile || !enabled) return null

  return (
    <>
      <section className={`fan-fun-card glass-card ${compact ? 'compact' : ''} ${className}`} aria-label="Legend Flag Surprise">
        <div className="fan-fun-header">
          <span className="fan-fun-icon" aria-hidden="true">
            <Sparkles size={15} />
          </span>
          <div>
            <h2>Fan Fun</h2>
            <p>Tap a flag for a legend surprise</p>
          </div>
        </div>

        <div className="fan-fun-buttons" role="list" aria-label="Choose a legend country flag">
          {LEGENDS.map((legend, index) => (
            <motion.button
              key={legend.id}
              type="button"
              className={`legend-flag-button ${legend.accentClass}`}
              aria-label={`Reveal ${legend.playerName} surprise`}
              onClick={() => revealLegend(legend)}
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      y: idleY,
                      transition: {
                        duration: hasSeenFunHint ? 3.2 : 2.4,
                        ease: 'easeInOut',
                        repeat: Infinity,
                        delay: index * 0.18
                      }
                    }
              }
              whileHover={prefersReducedMotion ? undefined : { scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.94 }}
            >
              <span className="legend-flag-glow" aria-hidden="true" />
              <span className={`legend-flag-visual flag-${legend.theme}`} aria-hidden="true" />
              <span className="legend-flag-label">{legend.country}</span>
              <AnimatePresence>
                {selectedLegend?.id === legend.id && isOpen ? (
                  <motion.span
                    className="legend-pop-spark"
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1.35 }}
                    exit={{ opacity: 0, scale: 1.8 }}
                    transition={{ duration: 0.28 }}
                  />
                ) : null}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </section>

      <LegendRevealModal legend={selectedLegend} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
