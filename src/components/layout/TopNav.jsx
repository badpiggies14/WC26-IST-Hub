import { Settings } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import APIStatusBadge from '../features/APIStatusBadge'
import NotificationBell from '../features/NotificationBell'
import SearchBar from '../ui/SearchBar'

const links = [
  { label: 'All Matches', to: '/schedule' },
  { label: 'Groups', to: '/groups' },
  { label: 'Teams', to: '/teams' },
  { label: 'Knockouts', to: '/knockouts' },
  { label: 'Favorites', to: '/favorites' }
]

export default function TopNav() {
  return (
    <header className="top-nav">
      <Link className="top-logo" to="/">
        <img src="/brand/wc26-ist-hub-mark.png" alt="WC26 IST Hub" />
        <span>WC26 IST Hub</span>
      </Link>
      <nav className="top-links" aria-label="Tournament sections">
        {links.map((link) => (
          <NavLink key={link.label} className={({ isActive }) => `top-link ${isActive ? 'active' : ''}`} to={link.to}>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="top-actions">
        <SearchBar />
        <APIStatusBadge />
        <NotificationBell />
        <Link className="icon-btn" to="/settings" aria-label="Settings">
          <Settings />
        </Link>
        <Link className="avatar" to="/teams" aria-label="All teams">
          48
        </Link>
      </div>
    </header>
  )
}
