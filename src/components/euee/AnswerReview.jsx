import QuestionCard from './QuestionCard'
import './AnswerReview.css'

function AnswerReview({ answers, currentIndex, onJump }) {
  const current = answers[currentIndex]
  if (!current) return null

  return (
    <section className="euee-answer-review" aria-labelledby="euee-review-title">
      <div className="euee-answer-review__header">
        <div>
          <span className="euee-section__kicker">Review answers</span>
          <h2 id="euee-review-title">Question {currentIndex + 1} of {answers.length}</h2>
        </div>
        <div className="euee-answer-review__nav">
          <button type="button" onClick={() => onJump(currentIndex - 1)} disabled={currentIndex === 0}>Previous</button>
          <button type="button" onClick={() => onJump(currentIndex + 1)} disabled={currentIndex === answers.length - 1}>Next</button>
        </div>
      </div>
      <QuestionCard
        question={{
          id: current.questionId,
          subjectId: current.subjectId,
          topic: current.topic,
          difficulty: current.difficulty,
          type: current.type,
          text: current.text,
          options: current.options,
          answer: current.answer,
          explanation: current.explanation,
          image: current.image,
        }}
        selected={current.selected}
        checked
        disabled
        reviewMode
        showStatus
      />
      <div className="euee-answer-review__dots">
        {answers.map((item, index) => (
          <button
            key={item.questionId}
            type="button"
            className={`euee-answer-review__dot ${index === currentIndex ? 'euee-answer-review__dot--current' : ''} ${item.correct ? 'euee-answer-review__dot--correct' : item.selected ? 'euee-answer-review__dot--wrong' : 'euee-answer-review__dot--unanswered'}`}
            onClick={() => onJump(index)}
            aria-label={`Review question ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  )
}

export default AnswerReview
