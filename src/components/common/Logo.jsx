import brandMark from '../../assets/clone-school-mark.svg'
import './Logo.css'

function Logo({ showWordmark = true, size = 'medium', tone = 'light', className = '' }) {
  const classes = ['logo', `logo--${size}`, `logo--${tone}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} role="img" aria-label="Clone School">
      <span className="logo__mark-wrap">
        <img className="logo__mark" src={brandMark} alt="" />
      </span>
      {showWordmark && (
        <span className="logo__wordmark" aria-hidden="true">
          <strong>Clone</strong>
          <span>School</span>
        </span>
      )}
    </div>
  )
}

export default Logo
