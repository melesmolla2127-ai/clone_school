import { Check, X } from 'lucide-react'
import { getEueeSubject } from '../../data/euee/eueeSubjects.js'
import './QuestionCard.css'

function QuestionCard({
  question,
  selected,
  onSelect,
  checked = false,
  disabled = false,
  showStatus = false,
  reviewMode = false,
}) {
  const subject = getEueeSubject(question.subjectId)

  return (
    <article className="euee-question-card">
      <div className="euee-question-card__meta">
        <span className="euee-question-card__pill">{subject?.name || question.subjectId}</span>
        <span className="euee-question-card__pill euee-question-card__pill--muted">{question.topic}</span>
        <span className="euee-question-card__pill euee-question-card__pill--muted">{question.difficulty}</span>
        {question.type && <span className="euee-question-card__pill euee-question-card__pill--muted">{question.type}</span>}
      </div>
      <h2 className="euee-question-card__prompt">{question.text}</h2>
      {question.image && <img className="euee-question-card__image" src={question.image} alt="" />}
      <div className="euee-question-card__options">
        {question.options.map((option, optionIndex) => {
          const isSelected = selected === option
          const isCorrect = option === question.answer
          const isWrong = checked && isSelected && !isCorrect
          const showCorrect = checked && isCorrect
          const className = [
            'euee-option',
            isSelected && 'euee-option--selected',
            showCorrect && 'euee-option--correct',
            isWrong && 'euee-option--wrong',
          ].filter(Boolean).join(' ')

          return (
            <button
              key={`${question.id}-${optionIndex}`}
              type="button"
              className={className}
              onClick={() => onSelect?.(option)}
              disabled={disabled || (checked && !reviewMode)}
              aria-pressed={isSelected}
            >
              <span className="euee-option__letter">{String.fromCharCode(65 + optionIndex)}</span>
              <span className="euee-option__text">{option}</span>
              {showCorrect && <Check size={16} aria-hidden="true" />}
              {isWrong && <X size={16} aria-hidden="true" />}
            </button>
          )
        })}
      </div>
      {checked && (
        <div className={`euee-question-card__feedback ${selected === question.answer ? 'euee-question-card__feedback--correct' : 'euee-question-card__feedback--incorrect'}`}>
          <strong>{selected === question.answer ? 'Correct' : selected ? 'Incorrect' : 'Unanswered'}</strong>
          <p>{question.explanation}</p>
        </div>
      )}
      {showStatus && reviewMode && (
        <div className="euee-question-card__review-status">
          <span><strong>Your answer:</strong> {selected || 'Unanswered'}</span>
          <span><strong>Correct answer:</strong> {question.answer}</span>
        </div>
      )}
    </article>
  )
}

export default QuestionCard
