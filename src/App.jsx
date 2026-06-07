import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import RollingFootball from './components/effects/RollingFootball'
import DesktopLoadingScreen from './components/effects/DesktopLoadingScreen'
import ErrorBoundary from './components/features/ErrorBoundary'
import MobileBottomNav from './components/layout/MobileBottomNav'
import Sidebar from './components/layout/Sidebar'
import TopNav from './components/layout/TopNav'
import { useLiveScores } from './hooks/useLiveScores'
import { useAppStore } from './store/useAppStore'
import Favorites from './pages/Favorites'
import Groups from './pages/Groups'
import Home from './pages/Home'
import Knockouts from './pages/Knockouts'
import MatchDetail from './pages/MatchDetail'
import Schedule from './pages/Schedule'
import Settings from './pages/Settings'
import Teams from './pages/Teams'
import TeamDetail from './pages/TeamDetail'

const SIDEBAR_COLLAPSED_KEY = 'wc2026_sidebar_collapsed'

function readSidebarCollapsed() {
  if (typeof window === 'undefined') return false

  try {
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
  } catch {
    return false
  }
}

export default function App() {
  useLiveScores()
  const appTheme = useAppStore((state) => state.appTheme)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readSidebarCollapsed)

  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, sidebarCollapsed ? 'true' : 'false')
    } catch {
      // Sidebar preference is optional; storage failures should not affect navigation.
    }
  }, [sidebarCollapsed])

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        document.querySelector('[data-global-search]')?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className={`app-shell theme-${appTheme || 'stadium'} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed((value) => !value)} />
      <main className="main-frame">
        <TopNav />
        <div className="page-content">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/knockouts" element={<Knockouts />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/match/:id" element={<MatchDetail />} />
              <Route path="/team/:code" element={<TeamDetail />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </main>
      <RollingFootball />
      <MobileBottomNav />
      <DesktopLoadingScreen />
    </div>
  )
}
