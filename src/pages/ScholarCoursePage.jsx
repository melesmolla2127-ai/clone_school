import { ArrowLeft, BookOpen, Lock, Sparkles, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import './ScholarCoursePage.css'

const PREVIEW_AREAS = [
  { title: 'Advanced Mathematics', detail: 'Problem solving, proofs, and competition-style thinking.' },
  { title: 'Science & Research', detail: 'Deeper physics, chemistry, biology, and scientific inquiry.' },
  { title: 'Critical Thinking', detail: 'Logic, argument analysis, and advanced reasoning skills.' },
  { title: 'Academic Writing', detail: 'Structured essays, research summaries, and communication.' },
]

function ScholarCoursePage() {
  const navigate = useNavigate()

  return (
    <div className="scholar-page">
      <button className="page-header__back" type="button" onClick={() => navigate('/courses')}>
        <ArrowLeft size={17} aria-hidden="true" />
        Back
      </button>

      <section className="scholar-lock-card">
        <div className="scholar-lock-card__glow" aria-hidden="true" />
        <div className="scholar-lock-card__icon" aria-hidden="true"><Lock size={30} /></div>
        <span className="scholar-lock-card__kicker"><Sparkles size={13} aria-hidden="true" /> Advanced academic learning</span>
        <h1>Scholar Course</h1>
        <p className="scholar-lock-card__status">Locked ? Coming Soon</p>
        <p className="scholar-lock-card__message">
          The Scholar Course is currently unavailable. It is being prepared as a premium advanced learning opportunity for students who want to go beyond the classroom.
        </p>
        <div className="scholar-lock-card__description">
          <BookOpen size={18} aria-hidden="true" />
          <p>Take your learning beyond the classroom. Scholar Course is designed for students who want to explore advanced topics, challenge their thinking, and develop deeper academic knowledge.</p>
        </div>
        <Button type="button" variant="secondary" onClick={() => navigate('/courses')}>Return to Courses</Button>
      </section>

      <section className="scholar-preview" aria-labelledby="scholar-preview-title">
        <div className="scholar-preview__heading">
          <span className="euee-section__kicker">Future learning opportunities</span>
          <h2 id="scholar-preview-title">What Scholar Course will offer</h2>
        </div>
        <div className="scholar-preview__grid">
          {PREVIEW_AREAS.map((area) => (
            <article key={area.title} className="scholar-preview__item">
              <span className="scholar-preview__star" aria-hidden="true"><Star size={16} /></span>
              <div>
                <h3>{area.title}</h3>
                <p>{area.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ScholarCoursePage
