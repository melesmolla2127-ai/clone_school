import './TextField.css'

function TextField({ icon: Icon, id, label, error, action, className = '', ...inputProps }) {
  const classes = ['text-field', error && 'text-field--error', className]
    .filter(Boolean)
    .join(' ')

  return (
    <label className={classes} htmlFor={id}>
      <span className="text-field__label">{label}</span>
      <span className="text-field__control">
        {Icon && <Icon size={18} strokeWidth={1.8} aria-hidden="true" />}
        <input
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...inputProps}
        />
        {action && <span className="text-field__action">{action}</span>}
      </span>
      {error && (
        <span className="text-field__error" id={`${id}-error`} role="alert">
          {error}
        </span>
      )}
    </label>
  )
}

export default TextField
