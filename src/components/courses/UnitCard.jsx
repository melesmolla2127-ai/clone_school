import { CheckCircle2, ChevronRight, ClipboardList, FileText, PlayCircle } from 'lucide-react'
import './UnitCard.css'

function UnitCard({ unit, tone = 'blue', completed = false, onOpen }) {
  return (
    <button className={`unit-card unit-card--${tone}`} type="button" onClick={onOpen}>
      <span className="unit-card__number">{String(unit.number).padStart(2, '0')}</span>

      <span className="unit-card__copy">
        <span className="unit-card__topline">
          <strong>{unit.title}</strong>
          {completed && (
            <span className="unit-card__done">
              <CheckCircle2 size={13} aria-hidden="true" />
              Done
            </span>
          )}
        </span>
        <small>{unit.description}</small>
        <span className="unit-card__counts">
          <span><FileText size={13} aria-hidden="true" /> {unit.noteCount}</span>
          <span><PlayCircle size={13} aria-hidden="true" /> {unit.videoCount}</span>
          <span><ClipboardList size={13} aria-hidden="true" /> {unit.questionCount}</span>
        </span>
      </span>

      <ChevronRight className="unit-card__chevron" size={18} aria-hidden="true" />
    </button>
  )
}

export default UnitCard
