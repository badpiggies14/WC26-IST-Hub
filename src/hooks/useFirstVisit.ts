import { useEffect, useState } from 'react'
import { CACHE_KEYS, readStorage, writeStorage } from '../lib/storage'

export const REPLAY_INTRO_EVENT = 'wc2026:replay-intro'
export const RESET_SETUP_EVENT = 'wc2026:reset-setup'

function readFlag(key: string, fallback = false) {
  return readStorage<boolean>(key, fallback)
}

function writeFlag(key: string, value: boolean) {
  writeStorage(key, value)
}

export function useFirstVisit() {
  const [showIntro, setShowIntro] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [tourStartSignal, setTourStartSignal] = useState(0)
  const [replayIntroOnly, setReplayIntroOnly] = useState(false)

  useEffect(() => {
    const introSeen = readFlag(CACHE_KEYS.introSeen)
    const setupCompleted = readFlag(CACHE_KEYS.setupCompleted)

    if (!introSeen) {
      setShowIntro(true)
      return
    }

    if (!setupCompleted) {
      setShowSetup(true)
      return
    }

    setTourStartSignal((value) => value + 1)
  }, [])

  useEffect(() => {
    const replayIntro = () => {
      setReplayIntroOnly(true)
      setShowIntro(true)
    }

    const resetSetup = () => {
      writeFlag(CACHE_KEYS.setupCompleted, false)
      setShowSetup(true)
    }

    window.addEventListener(REPLAY_INTRO_EVENT, replayIntro)
    window.addEventListener(RESET_SETUP_EVENT, resetSetup)

    return () => {
      window.removeEventListener(REPLAY_INTRO_EVENT, replayIntro)
      window.removeEventListener(RESET_SETUP_EVENT, resetSetup)
    }
  }, [])

  const completeIntro = () => {
    writeFlag(CACHE_KEYS.introSeen, true)
    setShowIntro(false)

    if (replayIntroOnly) {
      setReplayIntroOnly(false)
      return
    }

    if (!readFlag(CACHE_KEYS.setupCompleted)) {
      setShowSetup(true)
      return
    }

    setTourStartSignal((value) => value + 1)
  }

  const completeSetup = () => {
    writeFlag(CACHE_KEYS.setupCompleted, true)
    setShowSetup(false)
    setTourStartSignal((value) => value + 1)
  }

  const skipSetup = () => {
    writeFlag(CACHE_KEYS.setupCompleted, true)
    setShowSetup(false)
    setTourStartSignal((value) => value + 1)
  }

  return {
    showIntro,
    showSetup,
    tourStartSignal,
    completeIntro,
    completeSetup,
    skipSetup
  }
}
