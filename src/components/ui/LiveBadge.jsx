export default function LiveBadge({ minute }) {
  return (
    <span className="status-badge live">
      <span className="live-dot" />
      LIVE {minute ? `${minute}'` : ''}
    </span>
  )
}
