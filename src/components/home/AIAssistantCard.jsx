import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { aiAssistant } from '../../data/homeData'
import Button from '../common/Button'
import './AIAssistantCard.css'

function AIAssistantCard() {
  const navigate = useNavigate()
  const Icon = aiAssistant.icon

  return (
    <section className="ai-card" aria-labelledby="ai-card-title">
      <div className="ai-card__icon" aria-hidden="true">
        <Icon size={22} strokeWidth={2} />
      </div>

      <div className="ai-card__copy">
        <span className="ai-card__badge">AI study assistant</span>
        <h3 id="ai-card-title">{aiAssistant.title}</h3>
        <p>{aiAssistant.description}</p>
      </div>

      <Button
        className="ai-card__button"
        type="button"
        variant="secondary"
        icon={ArrowRight}
        onClick={() => navigate(aiAssistant.path)}
      >
        Start conversation
      </Button>
    </section>
  )
}

export default AIAssistantCard
