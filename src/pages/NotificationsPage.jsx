import { useCallback, useMemo, useState } from 'react'
import { BellRing, CheckCheck, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import EmptyState from '../components/courses/EmptyState'
import PageHeader from '../components/courses/PageHeader'
import ConfirmDialog from '../components/notifications/ConfirmDialog'
import NotificationFilters from '../components/notifications/NotificationFilters'
import NotificationItem from '../components/notifications/NotificationItem'
import useNotifications from '../hooks/useNotifications'
import { NOTIFICATION_CATEGORIES } from '../services/notificationService'
import './NotificationsPage.css'

function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead, remove, clearAll } = useNotifications()
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('all')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const counts = useMemo(() => {
    const result = { all: unreadCount }
    NOTIFICATION_CATEGORIES.forEach(({ id }) => {
      if (id !== 'all') result[id] = 0
    })
    notifications.forEach((notification) => {
      if (!notification.read && result[notification.category] !== undefined) {
        result[notification.category] += 1
      }
    })
    return result
  }, [notifications, unreadCount])

  const visibleNotifications = useMemo(
    () => (activeCategory === 'all' ? notifications : notifications.filter((item) => item.category === activeCategory)),
    [activeCategory, notifications],
  )

  const handleOpen = useCallback(
    (notification) => {
      if (!notification.read) markRead(notification.id)
      if (notification.actionPath) navigate(notification.actionPath)
    },
    [markRead, navigate],
  )

  const handleClear = () => {
    clearAll()
    setActiveCategory('all')
    setConfirmOpen(false)
  }

  const showEmptyAction = activeCategory !== 'all' && notifications.length > 0

  return (
    <section className="notifications-page">
      <PageHeader
        kicker="Stay in the loop"
        title="Notifications"
        description="Everything happening across your courses, practice, games, and EUEE preparation."
        backTo="/home"
        action={
          <div className="notifications-page__actions">
            <Button
              className="notifications-page__mark-all"
              type="button"
              icon={CheckCheck}
              disabled={!unreadCount}
              onClick={markAllRead}
            >
              Mark all as read
            </Button>
            <Button
              className="notifications-page__clear"
              type="button"
              variant="secondary"
              icon={Trash2}
              disabled={!notifications.length}
              onClick={() => setConfirmOpen(true)}
            >
              Clear all
            </Button>
          </div>
        }
      />

      <div className="notifications-page__summary">
        <span className="notifications-page__summary-icon" aria-hidden="true">
          <BellRing size={20} strokeWidth={2} />
        </span>
        <div className="notifications-page__summary-copy">
          <strong>{notifications.length} total</strong>
          <span>Notifications are stored in this browser.</span>
        </div>
        <span className="notifications-page__unread-badge">{unreadCount} unread</span>
      </div>

      <NotificationFilters
        categories={NOTIFICATION_CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        counts={counts}
      />

      {visibleNotifications.length > 0 ? (
        <div className="notifications-page__list">
          {visibleNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={markRead}
              onDelete={remove}
              onOpen={handleOpen}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BellRing}
          title="No notifications yet"
          message={
            showEmptyAction
              ? 'There are no notifications in this category. Check another category to see the rest.'
              : 'When there is news about your learning, it will appear here.'
          }
          actionLabel={showEmptyAction ? 'View all notifications' : undefined}
          onAction={showEmptyAction ? () => setActiveCategory('all') : undefined}
        />
      )}

      {confirmOpen && (
        <ConfirmDialog
          title="Clear all notifications?"
          description="Every notification will be removed from this browser. This cannot be undone."
          confirmLabel="Confirm clear"
          cancelLabel="Keep notifications"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleClear}
        />
      )}
    </section>
  )
}

export default NotificationsPage
