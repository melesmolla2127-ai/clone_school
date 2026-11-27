import CheckboxField from '../auth/CheckboxField'
import './ToggleRow.css'

function ToggleRow({ id, label, description, checked, onChange, disabled = false, className = '' }) {
  return (
    <div className={`toggle-row ${className}`.trim()}>
      <div className="toggle-row__copy">
        <label className="toggle-row__label" htmlFor={id}>
          {label}
        </label>
        {description && <p className="toggle-row__description">{description}</p>}
      </div>
      <CheckboxField
        id={id}
        className="toggle-row__checkbox"
        label=""
        checked={checked}
        disabled={disabled}
        aria-label={label}
        onChange={(event) => onChange(event.target.checked)}
      />
    </div>
  )
}

export default ToggleRow
