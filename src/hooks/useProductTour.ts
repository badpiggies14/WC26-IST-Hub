import { useEffect, useState } from 'react'
import { CACHE_KEYS, readStorage, writeStorage } from '../lib/storage'
import { TOUR_STEPS } from '../data/tourSteps'

export const REPLAY_TUTORIAL_EVENT = 'wc2026:replay-tutorial'

export function useProductTour(autoStartSignal = 0) {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const startTour = () => {
    setCurrentStep(0)
    setIsActive(true)
  }

  const closeTour = (completed = true) => {
    if (completed) writeStorage(CACHE_KEYS.tutorialCompleted, true)
    setIsActive(false)
  }

  useEffect(() => {
    if (!autoStartSignal) return
    if (!readStorage<boolean>(CACHE_KEYS.tutorialCompleted, false)) startTour()
  }, [autoStartSignal])

  useEffect(() => {
    const replayTutorial = () => {
      writeStorage(CACHE_KEYS.tutorialCompleted, false)
      startTour()
    }

    window.addEventListener(REPLAY_TUTORIAL_EVENT, replayTutorial)
    return () => window.removeEventListener(REPLAY_TUTORIAL_EVENT, replayTutorial)
  }, [])

  const next = () => {
    if (currentStep >= TOUR_STEPS.length - 1) {
      closeTour(true)
      return
    }

    setCurrentStep((step) => step + 1)
  }

  const back = () => setCurrentStep((step) => Math.max(0, step - 1))

  return {
    isActive,
    currentStep,
    totalSteps: TOUR_STEPS.length,
    step: TOUR_STEPS[currentStep],
    next,
    back,
    skip: () => closeTour(true),
    finish: () => closeTour(true),
    startTour
  }
}
