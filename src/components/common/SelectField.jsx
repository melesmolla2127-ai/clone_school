import { ChevronDown } from 'lucide-react'
import './SelectField.css'

function SelectField({
  icon: Icon,
  id,
  label,
  options = [],
  placeholder = 'Select an option',
  error,
  className = '',
  ...selectProps
}) {
  const classes = ['text-field', 'select-field', error && 'text-field--error', className]
    .filter(Boolean)
    .join(' ')

  return (
    <label className={classes} htmlFor={id}>
      <span className="text-field__label">{label}</span>
      <span className="text-field__control">
        {Icon && <Icon size={18} strokeWidth={1.8} aria-hidden="true" />}
        <select
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...selectProps}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="select-field__chevron" size={18} aria-hidden="true" />
      </span>
      {error && (
        <span className="text-field__error" id={`${id}-error`} role="alert">
          {error}
        </span>
      )}
    </label>
  )
}

export default SelectField
