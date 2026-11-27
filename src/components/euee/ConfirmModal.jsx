import Button from '../common/Button'
import './ConfirmModal.css'

function ConfirmModal({ open, title, message, details = [], confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="euee-modal" role="dialog" aria-modal="true" aria-labelledby="euee-modal-title">
      <div className="euee-modal__backdrop" />
      <div className="euee-modal__card">
        <h2 id="euee-modal-title">{title}</h2>
        <p>{message}</p>
        {details.length > 0 && (
          <dl className="euee-modal__details">
            {details.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="euee-modal__actions">
          <Button type="button" variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button type="button" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
