import './ProgressBar.css'

function ProgressBar({ value = 0, label, showValue = true, className = '' }) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)))

  return (
    <div className={`progress-track ${className}`.trim()}>
      {(label || showValue) && (
        <div className="progress-track__label">
          {label && <span>{label}</span>}
          {showValue && <strong>{safeValue}%</strong>}
        </div>
      )}
      <div
        className="progress-track__rail"
        role="progressbar"
        aria-label={label || 'Progress'}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={safeValue}
      >
        <span style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  )
}

export default ProgressBar
