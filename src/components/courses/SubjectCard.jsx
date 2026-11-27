import { ArrowUpRight } from 'lucide-react'
import ProgressBar from './ProgressBar'
import './SubjectCard.css'

function SubjectCard({ subject, progress, onClick }) {
  const Icon = subject.icon

  return (
    <button className={`subject-card subject-card--${subject.tone}`} type="button" onClick={onClick}>
      <span className="subject-card__icon" aria-hidden="true">
        <Icon size={24} strokeWidth={1.9} />
      </span>

      <span className="subject-card__copy">
        <strong>{subject.title}</strong>
        <small>{subject.description}</small>
      </span>

      <ProgressBar value={progress?.percent || 0} label={`${progress?.completed || 0}/${progress?.total || subject.units.length} units`} />

      <span className="subject-card__footer">
        <span>{subject.units.length} units</span>
        <span className="subject-card__open">
          Open <ArrowUpRight size={14} aria-hidden="true" />
        </span>
      </span>
    </button>
  )
}

export default SubjectCard
