import { Search } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

export default function SearchBar({ placeholder = 'Search teams, players...' }) {
  const searchQuery = useAppStore((state) => state.searchQuery)
  const setSearchQuery = useAppStore((state) => state.setSearchQuery)

  return (
    <label className="search-bar" aria-label="Global search">
      <input
        data-global-search
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder={placeholder}
      />
      <Search aria-hidden="true" />
    </label>
  )
}
