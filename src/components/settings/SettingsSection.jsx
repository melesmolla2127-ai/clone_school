import './SettingsSection.css'

function SettingsSection({ icon: Icon, title, description, action, children }) {
  return (
    <section className="settings-section" aria-label={title}>
      <header className="settings-section__header">
        <span className="settings-section__icon" aria-hidden="true">
          {Icon && <Icon size={18} strokeWidth={2} />}
        </span>
        <div className="settings-section__copy">
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {action && <div className="settings-section__action">{action}</div>}
      </header>
      {children && <div className="settings-section__body">{children}</div>}
    </section>
  )
}

export default SettingsSection
