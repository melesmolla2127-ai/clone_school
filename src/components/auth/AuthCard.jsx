import './AuthCard.css'

function AuthCard({
  badge,
  badgeIcon: BadgeIcon,
  title,
  subtitle,
  titleId = 'auth-title',
  children,
  footer,
  className = '',
}) {
  const classes = ['auth-card', className].filter(Boolean).join(' ')

  return (
    <section className={classes} aria-labelledby={titleId}>
      {badge && (
        <div className="auth-card__badge">
          {BadgeIcon && <BadgeIcon size={14} strokeWidth={2} aria-hidden="true" />}
          {badge}
        </div>
      )}

      <h1 className="auth-card__title" id={titleId}>
        {title}
      </h1>
      {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}

      <div className="auth-card__body">{children}</div>

      {footer && <div className="auth-card__footer">{footer}</div>}
    </section>
  )
}

export default AuthCard
