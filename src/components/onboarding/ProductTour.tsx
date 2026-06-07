import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { TOUR_STEPS } from '../../data/tourSteps'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import SpotlightOverlay from './SpotlightOverlay'
import TourStep from './TourStep'

type ProductTourProps = {
  isActive: boolean
  currentStep: number
  onBack: () => void
  onNext: () => void
  onSkip: () => void
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined

    const media = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return isMobile
}

export default function ProductTour({ isActive, currentStep, onBack, onNext, onSkip }: ProductTourProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  const [rect, setRect] = useState<DOMRect | null>(null)
  const step = TOUR_STEPS[currentStep]

  useEffect(() => {
    if (!isActive) return undefined

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onSkip()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isActive, onSkip])

  useEffect(() => {
    if (!isActive || !step) return undefined

    let frame = 0
    const measure = () => {
      frame = 0
      if (step.mobileOnly && !isMobile) {
        setRect(null)
        return
      }

      const target = step.selector ? document.querySelector(step.selector) : null
      if (!target) {
        setRect(null)
        return
      }

      target.scrollIntoView({ block: 'center', inline: 'nearest', behavior: prefersReducedMotion ? 'auto' : 'smooth' })
      window.setTimeout(() => setRect(target.getBoundingClientRect()), prefersReducedMotion ? 40 : 240)
    }

    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(measure)
    }

    schedule()
    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', schedule, { passive: true })

    return () => {
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [currentStep, isActive, isMobile, prefersReducedMotion, step])

  const cardStyle = useMemo(() => {
    if (isMobile || !rect) return undefined
    const preferRight = rect.left + rect.width / 2 < window.innerWidth / 2
    return {
      left: preferRight ? Math.min(window.innerWidth - 390, rect.right + 22) : Math.max(24, rect.left - 386),
      top: Math.min(window.innerHeight - 300, Math.max(92, rect.top))
    }
  }, [isMobile, rect])

  return (
    <AnimatePresence>
      {isActive && step ? (
        <motion.div
          className="product-tour"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.12 : 0.22 }}
        >
          <SpotlightOverlay rect={rect} />
          <div className="tour-card-position" style={cardStyle}>
            <TourStep step={step} index={currentStep} total={TOUR_STEPS.length} isMobile={isMobile} onBack={onBack} onNext={onNext} onSkip={onSkip} />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
