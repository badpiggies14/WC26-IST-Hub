import { RefreshCw } from 'lucide-react'
import { formatCacheTimestamp } from '../../lib/storage'
import { useWorldCupData } from '../../hooks/useWorldCupData'

const labels = {
  idle: 'Offline',
  loading: 'Loading',
  live: 'Live',
  cached: 'Cached',
  offline: 'Offline',
  auth: 'Auth Required',
  error: 'Error'
}

export default function APIStatusBadge({ compact = false }) {
  const apiStatus = useWorldCupData((state) => state.apiStatus)
  const isLoading = useWorldCupData((state) => state.isLoading)
  const lastUpdated = useWorldCupData((state) => state.lastUpdated)
  const error = useWorldCupData((state) => state.error)
  const refresh = useWorldCupData((state) => state.refresh)
  const status = isLoading ? 'loading' : apiStatus

  return (
    <div className={`api-status api-status--${status} ${compact ? 'compact' : ''}`} title={error || ''}>
      <span className="live-dot" />
      <span>{labels[status] || 'API'}</span>
      {!compact ? <small>{status === 'cached' ? `from ${formatCacheTimestamp(lastUpdated)}` : lastUpdated ? formatCacheTimestamp(lastUpdated) : 'ready'}</small> : null}
      {!compact ? (
        <button type="button" aria-label="Refresh API data" onClick={() => refresh()}>
          <RefreshCw size={14} />
        </button>
      ) : null}
    </div>
  )
}
