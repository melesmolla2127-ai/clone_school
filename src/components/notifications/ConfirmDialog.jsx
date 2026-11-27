import { useEffect, useId, useRef } from 'react'
import { CircleAlert } from 'lucide-react'
import Button from '../common/Button'
import './ConfirmDialog.css'

function ConfirmDialog({ title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel }) {
  const titleId = useId()
  const descriptionId = useId()
  const panelRef = useRef(null)

  useEffect(() => {
    panelRef.current?.querySelector('.confirm-dialog__cancel')?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div
      className="confirm-dialog"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
    >
      <section
        ref={panelRef}
        className="confirm-dialog__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <span className="confirm-dialog__icon" aria-hidden="true">
          <CircleAlert size={22} strokeWidth={2} />
        </span>
        <h2 className="confirm-dialog__title" id={titleId}>{title}</h2>
        <p className="confirm-dialog__description" id={descriptionId}>{description}</p>

        <div className="confirm-dialog__actions">
          <Button className="confirm-dialog__cancel" type="button" variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button className="confirm-dialog__confirm" type="button" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmDialog
