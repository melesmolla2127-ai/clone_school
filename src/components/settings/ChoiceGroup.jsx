import './ChoiceGroup.css'

function ChoiceGroup({ label, value, options = [], onChange, className = '' }) {
  return (
    <div className={`choice-group ${className}`.trim()} role="radiogroup" aria-label={label}>
      {options.map((option) => {
        const Icon = option.icon
        const isActive = option.value === value

        return (
          <button
            key={option.value}
            className={isActive ? 'choice-group__option choice-group__option--active' : 'choice-group__option'}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
          >
            {Icon && <Icon size={16} aria-hidden="true" />}
            <span>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default ChoiceGroup
