import './LoadingIndicator.css'

function LoadingIndicator({ label = 'Loading' }) {
  return (
    <div className="loading-indicator" role="status" aria-live="polite">
      <span className="loading-indicator__dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span>{label}</span>
    </div>
  )
}

export default LoadingIndicator
