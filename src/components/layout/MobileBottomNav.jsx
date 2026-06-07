import { BarChart3, CalendarDays, Settings, Star, Trophy } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  { label: 'Matches', to: '/schedule', icon: CalendarDays },
  { label: 'Groups', to: '/groups', icon: BarChart3 },
  { label: 'Brackets', to: '/knockouts', icon: Trophy },
  { label: 'Saved', to: '/favorites', icon: Star },
  { label: 'Settings', to: '/settings', icon: Settings }
]

export default function MobileBottomNav() {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.label}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            to={item.to}
          >
            <Icon />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
