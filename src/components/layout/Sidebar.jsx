import { BarChart3, CalendarDays, ChevronLeft, ChevronRight, Home, Radio, Settings, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Schedule', to: '/schedule', icon: CalendarDays },
  { label: 'Standings', to: '/groups', icon: BarChart3 },
  { label: 'Teams', to: '/teams', icon: Users }
]

export default function Sidebar({ collapsed = false, onToggleSidebar }) {
  return (
    <aside className="sidebar" aria-label={collapsed ? 'Collapsed primary navigation' : 'Primary navigation'}>
      <div className="sidebar-brand">
        <NavLink className="brand-lockup" to="/">
          <img
            src={collapsed ? '/brand/wc26-ist-hub-mark.png' : '/brand/wc26-ist-hub-lockup.png'}
            alt="WC26 IST Hub"
          />
        </NavLink>
      </div>

      <button
        className="sidebar-toggle"
        type="button"
        onClick={onToggleSidebar}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>

      <div className="sidebar-live">
        <NavLink className="btn btn-primary sidebar-live-btn" to="/schedule" aria-label="Live matches" title="Live Matches">
          <Radio />
          <span>Live Matches</span>
        </NavLink>
      </div>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.label}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              to={item.to}
              aria-label={item.label}
              title={collapsed ? item.label : undefined}
            >
              <Icon />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="sidebar-spacer" />

      <div className="sidebar-footer">
        <NavLink className="nav-item" to="/settings" aria-label="Settings" title={collapsed ? 'Settings' : undefined}>
          <Settings />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  )
}
