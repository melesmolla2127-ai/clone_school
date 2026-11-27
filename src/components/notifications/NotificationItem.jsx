import {
  ArrowUpRight,
  Bell,
  BookOpen,
  CheckCheck,
  Clock3,
  Gamepad2,
  GraduationCap,
  Megaphone,
  Sparkles,
  Trash2,
  Trophy,
} from 'lucide-react'
import Button from '../common/Button'
import './NotificationItem.css'

const ICONS = {
  Bell,
  BookOpen,
  CheckCheck,
  Clock3,
  Gamepad2,
  GraduationCap,
  Megaphone,
  Sparkles,
  Trophy,
}

const CATEGORY_ICONS = {
  announcements: Megaphone,
  courses: BookOpen,
  study: Clock3,
  games: Gamepad2,
  achievements: Trophy,
  euee: GraduationCap,
  system: Sparkles,
}

const CATEGORY_LABELS = {
  announcements: 'Announcements',
  courses: 'Courses',
  study: 'Study reminders',
  games: 'Games',
  achievements: 'Achievements',
  euee: 'EUEE',
  system: 'System',
}

function formatRelativeTime(value) {
  if (!value) return 'Just now'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Just now'

  const minutes = Math.floor((Date.now() - date.getTime()) / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`

  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

function NotificationItem({ notification, onMarkRead, onDelete, onOpen }) {
  const { id, category, title, message, createdAt, read, actionPath, iconName } = notification
  const safeCategory = CATEGORY_LABELS[category] ? category : 'system'
  const Icon = ICONS[iconName] || CATEGORY_ICONS[safeCategory] || Bell

  return (
    <article
      className={`notification-item notification-item--${safeCategory} ${read ? 'notification-item--read' : 'notification-item--unread'}`}
    >
      <span className="notification-item__icon" aria-hidden="true">
        <Icon size={20} strokeWidth={2} />
      </span>

      <div className="notification-item__body">
        <div className="notification-item__heading">
          <h3 className="notification-item__title">{title}</h3>
          {!read && <span className="notification-item__status">Unread</span>}
        </div>

        <p className="notification-item__message">{message}</p>

        <div className="notification-item__meta">
          <span className="notification-item__category">{CATEGORY_LABELS[safeCategory]}</span>
          <span className="notification-item__separator" aria-hidden="true">·</span>
          <time className="notification-item__time" dateTime={createdAt}>
            {formatRelativeTime(createdAt)}
          </time>
        </div>

        <div className="notification-item__actions">
          {!read && (
            <Button
              className="notification-item__read-button"
              type="button"
              variant="secondary"
              icon={CheckCheck}
              onClick={() => onMarkRead(id)}
            >
              Mark as read
            </Button>
          )}
          {actionPath && (
            <Button
              className="notification-item__open-button"
              type="button"
              icon={ArrowUpRight}
              onClick={() => onOpen(notification)}
            >
              Open
            </Button>
          )}
          <Button
            className="notification-item__delete-button"
            type="button"
            variant="secondary"
            icon={Trash2}
            onClick={() => onDelete(id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </article>
  )
}

export default NotificationItem
