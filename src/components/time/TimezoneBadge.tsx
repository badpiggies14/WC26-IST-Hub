type TimezoneBadgeProps = {
  label: string
  value: string
  tone?: 'gold' | 'blue' | 'neutral'
}

export default function TimezoneBadge({ label, value, tone = 'neutral' }: TimezoneBadgeProps) {
  return (
    <span className={`timezone-badge timezone-badge--${tone}`}>
      <strong>{label}</strong>
      {value}
    </span>
  )
}
