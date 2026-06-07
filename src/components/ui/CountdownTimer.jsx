import { useCountdown } from '../../hooks/useCountdown'

function pad(value, digits = 2) {
  return String(Math.max(0, value)).padStart(digits, '0')
}

export default function CountdownTimer({ targetDate, mobile = false }) {
  const timeLeft = useCountdown(targetDate)
  const cells = [
    { label: 'Days', value: pad(timeLeft.days, 3) },
    { label: 'Hours', value: pad(timeLeft.hours) },
    { label: 'Minutes', value: pad(timeLeft.minutes) },
    ...(mobile ? [] : [{ label: 'Seconds', value: pad(timeLeft.seconds) }])
  ]

  return (
    <div className="countdown" aria-label="Countdown timer">
      {cells.map((cell, index) => (
        <div className="contents" key={cell.label}>
          {index > 0 ? <span className="countdown-sep">:</span> : null}
          <div className="countdown-cell">
            <span className="countdown-value">{cell.value}</span>
            <span className="countdown-label">{cell.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
