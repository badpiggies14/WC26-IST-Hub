import type { CSSProperties } from 'react'

type SpotlightOverlayProps = {
  rect: DOMRect | null
}

export default function SpotlightOverlay({ rect }: SpotlightOverlayProps) {
  const style: CSSProperties = rect
    ? {
        left: Math.max(12, rect.left - 10),
        top: Math.max(12, rect.top - 10),
        width: rect.width + 20,
        height: rect.height + 20
      }
    : {}

  return (
    <>
      <div className="tour-dim" aria-hidden="true" />
      {rect ? <div className="tour-spotlight-ring" style={style} aria-hidden="true" /> : null}
    </>
  )
}
