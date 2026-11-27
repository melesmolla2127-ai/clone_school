import { Bell, BookOpen, Clock3, Gamepad2, GraduationCap, Megaphone, Sparkles, Trophy } from 'lucide-react'
import './NotificationFilters.css'

const CATEGORY_ICONS = {
  all: Bell,
  announcements: Megaphone,
  courses: BookOpen,
  study: Clock3,
  games: Gamepad2,
  achievements: Trophy,
  euee: GraduationCap,
  system: Sparkles,
}

function NotificationFilters({ categories, activeCategory, onCategoryChange, counts = {} }) {
  return (
    <nav className="notification-filters" aria-label="Filter notifications by category">
      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category.id] || Bell
        const count = Math.max(0, Number(counts[category.id]) || 0)
        const isActive = category.id === activeCategory

        return (
          <button
            key={category.id}
            className={`notification-filters__chip ${isActive ? 'notification-filters__chip--active' : ''}`.trim()}
            type="button"
            aria-pressed={isActive}
            onClick={() => onCategoryChange(category.id)}
          >
            <Icon size={14} strokeWidth={2.2} aria-hidden="true" />
            <span>{category.label}</span>
            {count > 0 && (
              <span className="notification-filters__count" aria-label={`${count} unread`}>
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}

export default NotificationFilters
