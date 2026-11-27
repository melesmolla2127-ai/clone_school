import { Check } from 'lucide-react'
import './CheckboxField.css'

function CheckboxField({ id, label, checked, onChange, className = '', ...inputProps }) {
  const classes = ['checkbox-field', className].filter(Boolean).join(' ')

  return (
    <label className={classes} htmlFor={id}>
      <input
        className="checkbox-field__input"
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        {...inputProps}
      />
      <span className="checkbox-field__box" aria-hidden="true">
        {checked && <Check size={13} strokeWidth={3} />}
      </span>
      <span className="checkbox-field__label">{label}</span>
    </label>
  )
}

export default CheckboxField
