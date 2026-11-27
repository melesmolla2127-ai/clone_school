import { Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useNotifications from '../../hooks/useNotifications'
import './NotificationBell.css'

function NotificationBell({ unreadCount, onClick, className = '' }) {
  const { unreadCount: contextUnreadCount } = useNotifications()
  const navigate = useNavigate()
  const count = Math.max(0, Number(unreadCount ?? contextUnreadCount) || 0)

  const handleClick = () => {
    if (onClick) onClick()
    else navigate('/notifications')
  }

  return (
    <button
      className={`notification-bell ${className}`.trim()}
      type="button"
      aria-label={count > 0 ? `Notifications, ${count} unread` : 'Notifications'}
      onClick={handleClick}
    >
      <Bell size={19} strokeWidth={2} aria-hidden="true" />
      {count > 0 && (
        <span className="notification-bell__badge" aria-hidden="true">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}

export default NotificationBell
