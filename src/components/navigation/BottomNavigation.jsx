import { BookOpen, Gamepad2, GraduationCap, House, UserRound } from 'lucide-react'
import useSettings from '../../hooks/useSettings'
import NavigationItem from './NavigationItem'
import './BottomNavigation.css'

const items = [
  { id: 'courses', labelKey: 'nav.courses', fallback: 'Courses', to: '/courses', icon: BookOpen },
  { id: 'games', labelKey: 'nav.games', fallback: 'Games', to: '/games', icon: Gamepad2 },
  { id: 'home', labelKey: 'nav.home', fallback: 'Home', to: '/home', icon: House, primary: true },
  { id: 'euee', labelKey: 'nav.euee', fallback: 'EUEE', to: '/euee', icon: GraduationCap },
  { id: 'profile', labelKey: 'nav.profile', fallback: 'Profile', to: '/profile', icon: UserRound },
]

function BottomNavigation() {
  const { t } = useSettings()

  return (
    <nav className="app-nav" aria-label="Main navigation">
      {items.map((item) => (
        <NavigationItem
          key={item.id}
          to={item.to}
          label={t(item.labelKey) === item.labelKey ? item.fallback : t(item.labelKey)}
          icon={item.icon}
          primary={item.primary}
        />
      ))}
    </nav>
  )
}

export default BottomNavigation
