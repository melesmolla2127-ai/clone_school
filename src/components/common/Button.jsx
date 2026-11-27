import './Button.css'

function Button({ children, icon: Icon, variant = 'primary', className = '', ...buttonProps }) {
  const classes = ['button', `button--${variant}`, className].filter(Boolean).join(' ')

  return (
    <button className={classes} {...buttonProps}>
      <span>{children}</span>
      {Icon && <Icon size={18} strokeWidth={2.2} aria-hidden="true" />}
    </button>
  )
}

export default Button
