import {
  Activity,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Gamepad2,
  GraduationCap,
  Trophy,
} from 'lucide-react'
import EmptyState from '../courses/EmptyState'
import './ActivityList.css'

const ACTIVITY_ICONS = {
  Activity,
  BookOpen,
  CalendarDays,
  Gamepad2,
  GraduationCap,
  Trophy,
}

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function ActivityList({
  items = [],
  title,
  emptyMessage,
  emptyActionLabel,
  onEmptyAction,
  onOpen,
  limit = 5,
}) {
  const visibleItems = items.slice(0, limit)

  if (!visibleItems.length) {
    return (
      <EmptyState
        icon={Activity}
        title={title}
        message={emptyMessage}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    )
  }

  return (
    <ul className="activity-list">
      {visibleItems.map((item) => {
        const Icon = ACTIVITY_ICONS[item.iconName] || Activity
        const content = (
          <>
            <span className="activity-list__icon" aria-hidden="true">
              <Icon size={18} strokeWidth={2} />
            </span>
            <span className="activity-list__copy">
              <strong>{item.title}</strong>
              <small>{item.detail}</small>
            </span>
            {item.at && (
              <time className="activity-list__date" dateTime={item.at}>
                {formatDate(item.at)}
              </time>
            )}
            {item.path && <ChevronRight className="activity-list__chevron" size={16} aria-hidden="true" />}
          </>
        )

        return (
          <li className="activity-list__item" key={item.id}>
            {item.path && onOpen ? (
              <button type="button" className="activity-list__button" onClick={() => onOpen(item.path)}>
                {content}
              </button>
            ) : (
              <div className="activity-list__button activity-list__button--static">{content}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default ActivityList
