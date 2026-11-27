import './StepProgress.css'

const STEP_LABELS = ['Student', 'Parent', 'Security']

function StepProgress({ current }) {
  return (
    <div className="step-progress" aria-label={`Step ${current} of ${STEP_LABELS.length}`}>
      <div className="step-progress__track" aria-hidden="true">
        <span
          className="step-progress__fill"
          style={{ width: `${((current - 1) / (STEP_LABELS.length - 1)) * 100}%` }}
        />
      </div>
      <div className="step-progress__steps">
        {STEP_LABELS.map((label, index) => {
          const step = index + 1
          const state = step < current ? 'done' : step === current ? 'active' : 'upcoming'

          return (
            <div className={`step-progress__step step-progress__step--${state}`} key={label}>
              <span className="step-progress__number">{step < current ? '✓' : step}</span>
              <span className="step-progress__label">{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StepProgress
