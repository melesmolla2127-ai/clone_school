import { EUEE_SUBJECTS } from '../../data/euee/eueeSubjects.js'
import './SubjectSelector.css'

function SubjectSelector({ selectedIds = [], onChange, disabled = false }) {
  const allSelected = selectedIds.length === EUEE_SUBJECTS.length

  const toggleAll = () => {
    if (disabled) return
    onChange(allSelected ? [] : EUEE_SUBJECTS.map((subject) => subject.id))
  }

  const toggleSubject = (subjectId) => {
    if (disabled) return
    if (selectedIds.includes(subjectId)) {
      onChange(selectedIds.filter((id) => id !== subjectId))
      return
    }
    onChange([...selectedIds, subjectId])
  }

  return (
    <div className="euee-subject-selector">
      <div className="euee-subject-selector__header">
        <span className="euee-subject-selector__label">Subjects</span>
        <button type="button" className="euee-subject-selector__all" onClick={toggleAll} disabled={disabled}>
          {allSelected ? 'Clear all' : 'Select all'}
        </button>
      </div>
      <div className="euee-subject-selector__grid">
        {EUEE_SUBJECTS.map((subject) => {
          const Icon = subject.icon
          const selected = selectedIds.includes(subject.id)
          return (
            <button
              key={subject.id}
              type="button"
              className={`euee-subject-selector__item ${selected ? 'euee-subject-selector__item--selected' : ''}`}
              onClick={() => toggleSubject(subject.id)}
              aria-pressed={selected}
              disabled={disabled}
            >
              <span className="euee-subject-selector__icon" aria-hidden="true"><Icon size={18} /></span>
              <span className="euee-subject-selector__name">{subject.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SubjectSelector
