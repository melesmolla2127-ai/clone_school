import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { quickAccessItems } from '../../data/homeData'
import HomeSectionHeading from './HomeSectionHeading'
import './QuickAccess.css'

function QuickAccess() {
  const navigate = useNavigate()

  return (
    <section className="quick-access" aria-labelledby="quick-access-title">
      <HomeSectionHeading kicker="Jump back in" title="Quick access" id="quick-access-title" />

      <div className="quick-access__grid">
        {quickAccessItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              className={`quick-access__card quick-access__card--${item.tone}`}
              key={item.id}
              type="button"
              onClick={() => navigate(item.path)}
            >
              <span className="quick-access__icon" aria-hidden="true">
                <Icon size={20} strokeWidth={2} />
              </span>
              <span className="quick-access__copy">
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>
              <ChevronRight className="quick-access__chevron" size={17} aria-hidden="true" />
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default QuickAccess
