import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { CACHE_KEYS, readStorage } from '../../lib/storage'

type CinematicIntroProps = {
  isOpen: boolean
  onComplete: () => void
}

export default function CinematicIntro({ isOpen, onComplete }: CinematicIntroProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [showSkip, setShowSkip] = useState(false)
  const onCompleteRef = useRef(onComplete)
  const introAnimationEnabled = readStorage<boolean>(CACHE_KEYS.introAnimationsEnabled, true)
  const simplifiedMotion = prefersReducedMotion || !introAnimationEnabled

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (!isOpen) return undefined

    setShowSkip(false)
    const skipTimer = window.setTimeout(() => setShowSkip(true), 500)
    const finishTimer = window.setTimeout(() => onCompleteRef.current(), simplifiedMotion ? 1200 : 3600)

    return () => {
      window.clearTimeout(skipTimer)
      window.clearTimeout(finishTimer)
    }
  }, [isOpen, simplifiedMotion])

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="cinematic-intro"
          role="dialog"
          aria-modal="true"
          aria-label="WC26 IST Hub intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: simplifiedMotion ? 1 : 1.04 }}
          transition={{ duration: simplifiedMotion ? 0.18 : 0.45 }}
        >
          <div className="intro-floodlight intro-floodlight-left" />
          <div className="intro-floodlight intro-floodlight-right" />
          <div className="intro-pitch-lines" />
          <motion.div
            className="intro-ball-mark"
            aria-hidden="true"
            initial={{ scale: 0.28, rotate: 0, opacity: 0 }}
            animate={
              simplifiedMotion
                ? { scale: 1, opacity: 1 }
                : { scale: [0.28, 0.48, 1.08, 0.92], rotate: [0, 140, 600, 720], opacity: [0, 1, 1, 1] }
            }
            transition={{ duration: simplifiedMotion ? 0.3 : 2.35, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <img src="/brand/wc26-ist-hub-mark.png" alt="" />
            <span />
          </motion.div>
          <motion.div
            className="intro-ring"
            aria-hidden="true"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={simplifiedMotion ? { scale: 1, opacity: 0.5 } : { scale: [0.4, 1.8, 2.4], opacity: [0, 0.55, 0] }}
            transition={{ duration: simplifiedMotion ? 0.2 : 2.6, delay: 0.45 }}
          />
          <motion.div
            className="intro-copy"
            initial={{ opacity: 0, y: simplifiedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: simplifiedMotion ? 0.15 : 1.45 }}
          >
            <span>Enter The Stadium</span>
            <h1>WC26 IST Hub</h1>
            <p>World Cup 2026. Every kickoff in your time.</p>
          </motion.div>
          {showSkip ? (
            <button className="intro-skip" type="button" onClick={onComplete}>
              Skip Intro
            </button>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
