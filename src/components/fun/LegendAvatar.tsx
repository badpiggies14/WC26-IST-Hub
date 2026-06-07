import type { Legend } from '../../data/legends'

type LegendAvatarProps = {
  legend: Legend
  className?: string
}

export default function LegendAvatar({ legend, className = '' }: LegendAvatarProps) {
  return (
    <div className={`legend-avatar-shell ${legend.accentClass} ${className}`} aria-hidden="true">
      {legend.id === 'messi' ? <MessiAvatar /> : null}
      {legend.id === 'ronaldo' ? <RonaldoAvatar /> : null}
      {legend.id === 'neymar' ? <NeymarAvatar /> : null}
    </div>
  )
}

function MessiAvatar() {
  return (
    <svg className="legend-avatar-svg" viewBox="0 0 220 220" fill="none">
      <path className="avatar-aura" d="M28 152c22-58 63-88 121-90 31 4 48 20 51 48-7 47-37 74-90 80-42 0-69-13-82-38Z" />
      <path className="avatar-leg back" d="M113 142c2 19 2 35-4 51" />
      <path className="avatar-leg front" d="M91 142c-10 20-24 32-44 37" />
      <circle className="avatar-ball" cx="41" cy="181" r="15" />
      <path className="avatar-boot" d="M31 183c9 7 19 8 29 2" />
      <path className="avatar-body argentina-shirt" d="M73 88c18-17 53-17 72 0l-4 57c-18 10-44 11-65 1L73 88Z" />
      <path className="avatar-stripe" d="M95 82v67" />
      <path className="avatar-stripe" d="M124 82v67" />
      <circle className="avatar-head" cx="109" cy="62" r="23" />
      <path className="avatar-hair dark" d="M86 61c4-22 29-31 47-17 9 7 10 15 8 24-16-9-33-11-55-7Z" />
      <path className="avatar-smile" d="M101 69c6 5 13 5 19 0" />
      <path className="avatar-arm left" d="M77 99c-19 8-31 20-37 37" />
      <path className="avatar-arm right" d="M143 99c12 9 21 21 27 37" />
      <path className="magic-arc" d="M58 158c21-2 36-12 46-31" />
      <path className="sparkle" d="M48 137l4 8 8 4-8 4-4 8-4-8-8-4 8-4 4-8Z" />
      <path className="sparkle small" d="M166 37l3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6Z" />
    </svg>
  )
}

function RonaldoAvatar() {
  return (
    <svg className="legend-avatar-svg" viewBox="0 0 220 220" fill="none">
      <path className="avatar-aura" d="M28 150c18-52 54-85 108-99 39 5 61 28 58 61-9 53-43 82-101 84-36-3-58-18-65-46Z" />
      <path className="energy-line" d="M38 72c13-14 29-24 49-31" />
      <path className="energy-line right" d="M172 55c10 8 18 20 25 36" />
      <path className="avatar-leg back" d="M123 144c13 12 25 22 41 29" />
      <path className="avatar-leg front" d="M95 142c-7 17-10 34-7 51" />
      <circle className="avatar-ball" cx="168" cy="181" r="15" />
      <path className="avatar-body portugal-shirt" d="M72 88c21-19 55-17 76 2l-7 57c-21 9-45 8-67-1L72 88Z" />
      <path className="avatar-sash" d="M110 80c9 17 19 36 33 57" />
      <circle className="avatar-head" cx="110" cy="60" r="23" />
      <path className="avatar-hair dark" d="M87 59c4-24 31-31 48-17 7 5 10 12 10 21-19-9-38-10-58-4Z" />
      <path className="avatar-smile" d="M99 68c7 6 16 6 23 0" />
      <path className="avatar-arm left up" d="M75 95c-22-21-36-37-42-50" />
      <path className="avatar-arm right up" d="M147 96c21-22 36-40 43-57" />
      <path className="jump-shadow" d="M70 195c27 8 59 8 87 0" />
    </svg>
  )
}

function NeymarAvatar() {
  return (
    <svg className="legend-avatar-svg" viewBox="0 0 220 220" fill="none">
      <path className="avatar-aura" d="M27 152c19-54 60-84 123-91 32 8 48 30 45 65-13 41-43 62-91 66-43-1-68-15-77-40Z" />
      <path className="samba-line" d="M37 126c19 6 37 3 54-10" />
      <path className="samba-line second" d="M134 165c22-1 39-10 52-27" />
      <path className="avatar-leg back" d="M120 143c7 17 18 29 34 37" />
      <path className="avatar-leg front" d="M91 144c-17 11-30 22-39 38" />
      <circle className="avatar-ball brazil-ball" cx="49" cy="184" r="15" />
      <path className="avatar-body brazil-shirt" d="M72 88c21-17 54-17 75 1l-5 58c-21 9-46 9-68-1L72 88Z" />
      <path className="avatar-diamond" d="M110 94l30 23-30 24-30-24 30-23Z" />
      <circle className="avatar-head" cx="110" cy="60" r="23" />
      <path className="avatar-hair playful" d="M86 58c6-20 24-31 42-23 2-9 8-14 18-15-2 11-1 22 4 33-14-7-35-6-64 5Z" />
      <path className="avatar-smile" d="M101 69c6 5 13 5 19 0" />
      <path className="avatar-arm left" d="M74 99c-16 3-30 12-42 27" />
      <path className="avatar-arm right" d="M146 98c15 9 25 22 30 38" />
      <path className="sparkle" d="M172 51l4 8 8 4-8 4-4 8-4-8-8-4 8-4 4-8Z" />
    </svg>
  )
}
