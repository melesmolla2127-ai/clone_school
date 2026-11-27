import Button from '../common/Button'
import './EmptyState.css'

function EmptyState({ icon: Icon, title, message, actionLabel, onAction, children }) {
  return (
    <section className="empty-state">
      <span className="empty-state__icon" aria-hidden="true">
        {Icon && <Icon size={26} />}
      </span>
      <h2>{title}</h2>
      <p>{message}</p>
      {children}
      {actionLabel && onAction && (
        <Button type="button" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </section>
  )
}

export default EmptyState
