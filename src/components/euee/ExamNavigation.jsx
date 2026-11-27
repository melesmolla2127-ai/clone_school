import './ExamNavigation.css'

function ExamNavigation({ questions, currentIndex, answers, marked, onJump }) {
  return (
    <div className="euee-exam-nav">
      <div className="euee-exam-nav__legend" aria-label="Question status legend">
        <span><i className="euee-exam-nav__dot euee-exam-nav__dot--current" /> Current</span>
        <span><i className="euee-exam-nav__dot euee-exam-nav__dot--answered" /> Answered</span>
        <span><i className="euee-exam-nav__dot euee-exam-nav__dot--unanswered" /> Unanswered</span>
        <span><i className="euee-exam-nav__dot euee-exam-nav__dot--marked" /> Marked</span>
      </div>
      <div className="euee-exam-nav__grid" role="navigation" aria-label="Question navigation">
        {questions.map((question, index) => {
          const isCurrent = index === currentIndex
          const isAnswered = Boolean(answers[question.id])
          const isMarked = marked.has(question.id)
          const className = [
            'euee-exam-nav__item',
            isCurrent && 'euee-exam-nav__item--current',
            isAnswered && 'euee-exam-nav__item--answered',
            !isAnswered && !isCurrent && 'euee-exam-nav__item--unanswered',
            isMarked && 'euee-exam-nav__item--marked',
          ].filter(Boolean).join(' ')

          return (
            <button
              key={question.id}
              type="button"
              className={className}
              onClick={() => onJump(index)}
              aria-label={`Question ${index + 1}${isAnswered ? ', Answered' : ', Unanswered'}${isMarked ? ', Marked for review' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {index + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ExamNavigation
