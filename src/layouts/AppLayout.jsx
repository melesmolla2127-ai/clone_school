import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AchievementToast from '../components/notifications/AchievementToast'
import BottomNavigation from '../components/navigation/BottomNavigation'
import { evaluateAchievements } from '../services/achievementService'
import './AppLayout.css'

function AppLayout() {
  const location = useLocation()

  useEffect(() => {
    const sync = () => evaluateAchievements()
    sync()
    globalThis.addEventListener?.('clone-school:progress-updated', sync)
    return () => globalThis.removeEventListener?.('clone-school:progress-updated', sync)
  }, [location.pathname])

  return (
    <div className="app-shell">
      <div className="app-shell__ambient" aria-hidden="true" />
      <main className="app-shell__content" key={location.pathname}>
        <Outlet />
      </main>
      <BottomNavigation />
      <AchievementToast />
    </div>
  )
}

export default AppLayout
