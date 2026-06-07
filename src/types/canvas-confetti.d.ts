declare module 'canvas-confetti' {
  export type ConfettiOptions = {
    particleCount?: number
    spread?: number
    startVelocity?: number
    gravity?: number
    ticks?: number
    scalar?: number
    origin?: { x?: number; y?: number }
    colors?: string[]
    disableForReducedMotion?: boolean
  }

  export type CreateOptions = {
    resize?: boolean
    useWorker?: boolean
  }

  export type ConfettiInstance = ((options?: ConfettiOptions) => Promise<null> | null) & {
    reset?: () => void
  }

  type ConfettiGlobal = ConfettiInstance & {
    create: (canvas: HTMLCanvasElement, options?: CreateOptions) => ConfettiInstance
  }

  const confetti: ConfettiGlobal
  export default confetti
}
