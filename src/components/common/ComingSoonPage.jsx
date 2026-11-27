import { ArrowLeft, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import Logo from '../common/Logo'
import './ComingSoonPage.css'

function ComingSoonPage({ icon: Icon, title, description, children }) {
  const navigate = useNavigate()

  return (
    <section className="coming-soon" aria-labelledby="coming-soon-title">
      <div className="coming-soon__glow" aria-hidden="true" />

      <div className="coming-soon__card">
        <div className="coming-soon__header">
          <Logo size="small" />
          <span className="coming-soon__badge">
            <Sparkles size={13} aria-hidden="true" />
            Future stage
          </span>
        </div>

        <div className="coming-soon__icon" aria-hidden="true">
          <Icon size={34} strokeWidth={1.8} />
        </div>

        <p className="coming-soon__eyebrow">Coming soon</p>
        <h1 id="coming-soon-title">{title}</h1>
        <p className="coming-soon__description">{description}</p>

        {children && <div className="coming-soon__extra">{children}</div>}

        <Button
          className="coming-soon__button"
          type="button"
          variant="secondary"
          icon={ArrowLeft}
          onClick={() => navigate('/home', { replace: true })}
        >
          Back to Home
        </Button>
      </div>
    </section>
  )
}

export default ComingSoonPage
