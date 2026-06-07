import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import type { Legend } from '../../data/legends'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import FunConfetti from './FunConfetti'
import LegendAvatar from './LegendAvatar'

type LegendRevealModalProps = {
  legend: Legend | null
  isOpen: boolean
  onClose: () => void
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function LegendRevealModal({ legend, isOpen, onClose }: LegendRevealModalProps) {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !dialogRef.current) return

    const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (node) => !node.hasAttribute('disabled') && node.tabIndex !== -1
    )

    if (!focusable.length) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const onOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && legend ? (
        <motion.div
          className="legend-modal-overlay"
          onMouseDown={onOverlayMouseDown}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <FunConfetti active={isOpen} legend={legend} />
          <motion.div
            ref={dialogRef}
            className={`legend-modal-card ${legend.accentClass}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            onKeyDown={trapFocus}
            initial={prefersReducedMotion ? false : { y: 34, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { y: 28, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <button ref={closeRef} className="legend-modal-close" type="button" onClick={onClose} aria-label="Close legend surprise">
              <X size={18} />
            </button>

            <div className="legend-modal-glow" />
            <div className="legend-modal-hero">
              <div className="legend-avatar-frame">
                <LegendAvatar legend={legend} />
              </div>
            </div>

            <div className="legend-reveal-copy">
              <span className="card-kicker">{legend.country} Surprise</span>
              <h2 id={titleId} className="legend-name">
                {legend.playerName}
              </h2>
              <p className="legend-nickname">{legend.nickname}</p>
              <p id={descriptionId} className="legend-line">
                {legend.funnyLine}
              </p>
              <span className="legend-chant">
                {legend.chant}
              </span>
            </div>

            <div className="legend-actions">
              <button className="btn btn-ghost" type="button" onClick={onClose}>
                Pick another legend
              </button>
              <button className="btn btn-primary" type="button" onClick={onClose}>
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
