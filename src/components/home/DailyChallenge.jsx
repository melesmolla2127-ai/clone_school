import { useNavigate } from 'react-router-dom'
import { dailyChallenge } from '../../data/homeData'
import Button from '../common/Button'
import './DailyChallenge.css'

function DailyChallenge() {
  const navigate = useNavigate()
  const Icon = dailyChallenge.icon

  return (
    <section className="challenge-card" aria-labelledby="challenge-title">
      <div className="challenge-card__top">
        <span className="challenge-card__badge">
          <Icon size={14} aria-hidden="true" />
          Daily challenge
        </span>
        <span className="challenge-card__points">+{dailyChallenge.points} pts</span>
      </div>

      <h3 id="challenge-title">{dailyChallenge.title}</h3>
      <p>{dailyChallenge.description}</p>

      <Button
        className="challenge-card__button"
        type="button"
        onClick={() => navigate(dailyChallenge.path)}
      >
        Start challenge
      </Button>
    </section>
  )
}

export default DailyChallenge
